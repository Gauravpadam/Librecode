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

    @Override
    public String generateTailCode(String inputParsing, String outputParsing, String methodToCall, int paramCount) {
        return """
            Public Class Solution {
                public static void main(String[] args) {
                    Scanner scanner = new Scanner(System.in);

                    ArrayList<String> input = new ArrayList()<>;

                    for (int i = 0, i < %i, i++){
                        input.append(Scanner.nextLine());
                    }

                    Result.%s()
                    scanner.close(); 
                }
            }
            """.formatted(innerCode);
    }

    @Override
    public String generateUserFunctionCall(String starterFunction){
        Pattern pattern = Pattern.compile(
            "\\b(?:public|protected|private|static|final|synchronized|abstract|\\s)+"
          + "[a-zA-Z_$][a-zA-Z0-9_$<>\\[\\]]*\\s+"
          + "([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\("
        );

        Matcher matcher = pattern.matcher(starterFunction);

        if (matcher.find()){
            String methodName = matcher.group(1);
            // I'll need the inputType here as well, for storing the parsed var before sending it
            return "%s(parsed);\n".formatted(methodName); // todo: Have scanners to take in and parse all agruments, and send all arguments in
        } else {
            throw new IllegalArgumentException("No valid method signature found in the provided code.");
        }
    }

   private MethodSignature parseStarterCode(String starterCode) {
    
    Pattern pattern = Pattern.compile(
        "(?:public|protected|private|static|\\s)+\\b([a-zA-Z_]\\w*)\\s*\\(([^)]*)\\)"
    );

    Matcher matcher = pattern.matcher(starterCode);

    if (!matcher.find()) {
        throw new IllegalArgumentException("No method signature found");
    }

    String method = matcher.group(1);
    String params = matcher.group(2).trim();

    int paramCount = 0;
    int depth = 0;

    for (int i = 0; i < params.length(); i++) {
        char c = params.charAt(i);
        if (c == '<') depth++;
        else if (c == '>') depth--;
        else if (c == ',' && depth == 0) paramCount++;
    }

    if (!params.isEmpty()) {
        paramCount++;
    }

    return new MethodSignature(method, paramCount);
}

}
