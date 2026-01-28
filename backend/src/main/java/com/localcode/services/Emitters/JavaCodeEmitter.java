package com.localcode.services;

import org.springframework.stereotype.Component;

import com.localcode.persistence.entity.InputType;

@Component("JavaCodeEmitter")
public class JavaCodeEmitter implements CodeEmitter{
   
    @Override
    public String generateImports(){ return "import java.util.*;\nimport java.util.stream.*;\n";} 

    @Override
    public String generateInputParsing(InputType inputType){
        return switch (inputType) {
            case INT -> "int parsed = Integer.parseInt(input.trim());\n";
            case STRING -> "String parsed = input.trim();\n";
            case ARRAY_INT -> """
                List<Integer> parsed = Arrays.stream(input.trim().substring(1, input.length()-1).split(","))
                                      .map(String::trim)
                                      .map(Integer::parseInt)
                                      .collect(Collectors.toList());
                """;
            case ARRAY_STRING -> """
                List<String> parsed = Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))
                                         .map(String::trim)
                                         .map(s -> s.replaceAll(\"^\\\\\"|\\\\\"$\", \"\"))
                                         .collect(Collectors.toList());
                """;
            case MATRIX_INT -> """
                String cleaned = input.trim().substring(1, input.length()-1);
                        List<List<Integer>> parsed = new ArrayList<>();
                        int depth = 0;
                        StringBuilder current = new StringBuilder();
                        for (char c : cleaned.toCharArray()) {
                            if (c == '[') depth++;
                            if (c == ']') depth--;
                            current.append(c);
                            if (depth == 0 && c == ']') {
                                parsed.add(parseRow(current.toString()));
                                current.setLength(0);
                            }
                        }
                        private static List<Integer> parseRow(String row) {
                            row = row.substring(1, row.length()-1);
                            if (row.isEmpty()) return List.of();
                            List<Integer> list = new ArrayList<>();
                            for (String val : row.split(\",\")) list.add(Integer.parseInt(val.trim()));
                            return list;
                        }
                """;
        default -> """
            throw new UnsupportedOperationException(\"Input type not supported\");
        """;
    };
}
    @Override
    public String generateOutputParsing(InputType inputType){
        // For now input & output parsing is symmetric
        return generateInputParsing(inputType);
}

}