package com.localcode.services;
import java.util.List;
import java.util.ArrayList;

import org.springframework.stereotype.Component;
import java.util.regex.*;
import com.localcode.persistence.entity.InputType;

@Component("JavaCodeEmitter")
public class JavaCodeEmitter implements CodeEmitter{

    class Param {
        final String type;
        final String name;
    
        Param(String type, String name) {
            this.type = type;
            this.name = name;
        }
    }
    
    class MethodSignature {
        final String methodName;
        final List<Param> params;
    
        MethodSignature(String methodName, List<Param> params) {
            this.methodName = methodName;
            this.params = params;
        }
    }    
   
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

        MethodSignature signature = parseStarterCode(methodToCall);
        return """
            Public Class Solution {
                public static void main(String[] args) {
                    Scanner scanner = new Scanner(System.in);

                    for (Param param : signature.params) {
                        // Generate input parsing code based on param type
                        switch (param.type) {
                            case "int":
                                %s
                                break;
                            case "String":
                                %s
                                break;
                            case "List<Integer>":
                                %s
                                break;
                            case "List<String>":
                                %s
                                break;
                            case "List<List<Integer>>":
                                %s
                                break;
                            default:
                                %s
                        }
                    }




                    Result.%s();
                    scanner.close(); 
                }
            }
            """.formatted(ignature.params.size(), signature.methodName);
    }


    private MethodSignature parseStarterCode(String starterCode) {

        Pattern pattern = Pattern.compile(
            "(?:public|protected|private|static|final|\\s)*" +
            "[\\w<>\\[\\]]+\\s+" +        // return type
            "([a-zA-Z_]\\w*)\\s*" +       // method name
            "\\(([^)]*)\\)"               // params
        );
    
        Matcher matcher = pattern.matcher(starterCode);
    
        if (!matcher.find()) {
            throw new IllegalArgumentException("No method signature found");
        }
    
        String methodName = matcher.group(1);
        String paramsStr = matcher.group(2).trim();
    
        List<Param> params = new ArrayList<>();
    
        if (!paramsStr.isEmpty()) {
            int depth = 0;
            int start = 0;
    
            for (int i = 0; i < paramsStr.length(); i++) {
                char c = paramsStr.charAt(i);
    
                if (c == '<') depth++;
                else if (c == '>') depth--;
                else if (c == ',' && depth == 0) {
                    extractParam(paramsStr.substring(start, i), params);
                    start = i + 1;
                }
            }
    
            // last param
            extractParam(paramsStr.substring(start), params);
        }
    
        return new MethodSignature(methodName, params);
    }

    private void extractParam(String raw, List<Param> params) {
        String param = raw.trim();
        int lastSpace = param.lastIndexOf(' ');

        if (lastSpace == -1) {
            throw new IllegalArgumentException("Invalid parameter: " + param);
        }

        String type = param.substring(0, lastSpace).trim();
        String name = param.substring(lastSpace + 1).trim();

        params.add(new Param(type, name));
    }

    
}
