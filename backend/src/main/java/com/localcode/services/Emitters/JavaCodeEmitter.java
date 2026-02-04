package com.localcode.services.Emitters;
import java.util.List;
import java.util.ArrayList;

import com.localcode.services.MethodSignature;
import org.springframework.stereotype.Component;
import java.util.regex.*;

import com.localcode.services.Param;
import com.localcode.services.DataType;

@Component("JavaCodeEmitter")
public class JavaCodeEmitter implements CodeEmitter{


    private DataType dataTypeMap(String paramType){
        return switch (paramType) {
        // primitives
        case "int" -> DataType.INT;
        case "long" -> DataType.LONG;
        case "double" -> DataType.DOUBLE;
        case "float" -> DataType.FLOAT;
        case "boolean" -> DataType.BOOLEAN;
        case "char" -> DataType.CHAR;

        // boxed / objects
        case "Integer" -> DataType.INT;
        case "Long" -> DataType.LONG;
        case "Double" -> DataType.DOUBLE;
        case "Float" -> DataType.FLOAT;
        case "Boolean" -> DataType.BOOLEAN;
        case "Character" -> DataType.CHAR;
        case "String" -> DataType.STRING;

        // primitive arrays
        case "int[]" -> DataType.ARRAY_INT;
        case "long[]" -> DataType.ARRAY_LONG;
        case "double[]" -> DataType.ARRAY_DOUBLE;
        case "String[]" -> DataType.ARRAY_STRING;

        // lists (common variants)
        case "List<Integer>" -> DataType.LIST_INT;
        case "ArrayList<Integer>" -> DataType.LIST_INT;
        case "LinkedList<Integer>" -> DataType.LIST_INT;
        case "List<Long>" -> DataType.LIST_LONG;
        case "ArrayList<Long>" -> DataType.LIST_LONG;
        case "List<Double>" -> DataType.LIST_DOUBLE;
        case "ArrayList<Double>" -> DataType.LIST_DOUBLE;
        case "List<String>" -> DataType.LIST_STRING;
        case "ArrayList<String>" -> DataType.LIST_STRING;

        // matrices
        case "int[][]" -> DataType.MATRIX_INT;
        case "long[][]" -> DataType.MATRIX_LONG;
        case "String[][]" -> DataType.MATRIX_STRING;

        default -> throw new IllegalArgumentException("Unknown Java type: " + paramType);
    };
}
   
    @Override
    public String generateImports(){ return "import java.util.*;\nimport java.util.stream.*;\n";} 

    @Override
    public String generateInputParsing(DataType javaDataType){
        return switch (javaDataType) {
            case INT -> "Integer.parseInt(input.trim())";
            case LONG -> "Long.parseLong(input.trim())";
            case DOUBLE -> "Double.parseDouble(input.trim())";
            case FLOAT -> "Float.parseFloat(input.trim())";
            case BOOLEAN -> "Boolean.parseBoolean(input.trim())";
            case CHAR -> "input.trim().charAt(0)";
            case STRING -> "input.trim()";
            
            case ARRAY_INT, LIST_INT -> 
                "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))" +
                ".map(String::trim).filter(s->!s.isEmpty()).map(Integer::parseInt).collect(Collectors.toList())";
            
            case ARRAY_LONG, LIST_LONG -> 
                "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))" +
                ".map(String::trim).filter(s->!s.isEmpty()).map(Long::parseLong).collect(Collectors.toList())";
            
            case ARRAY_DOUBLE, LIST_DOUBLE -> 
                "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))" +
                ".map(String::trim).filter(s->!s.isEmpty()).map(Double::parseDouble).collect(Collectors.toList())";
            
            case ARRAY_STRING, LIST_STRING -> 
                "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))" +
                ".map(String::trim).map(s->s.replaceAll(\"^\\\"|\\\"$\", \"\")).collect(Collectors.toList())";
            
            case MATRIX_INT -> 
                "(() -> { String tmp = input.trim().substring(1, input.trim().length()-1); " +
                "List<List<Integer>> result = new ArrayList<>(); " +
                "if (!tmp.isEmpty()) { String[] rows = tmp.split(\"\\\\],\\\\s*\\\\[\"); " +
                "for (String r : rows) { r = r.replaceAll(\"^\\\\[|\\\\]$\", \"\"); " +
                "List<Integer> row = new ArrayList<>(); " +
                "for (String v : r.split(\",\")) if (!v.trim().isEmpty()) row.add(Integer.parseInt(v.trim())); " +
                "result.add(row); } } return result; })()";
            
            case MATRIX_LONG -> 
                "(() -> { String tmp = input.trim().substring(1, input.trim().length()-1); " +
                "List<List<Long>> result = new ArrayList<>(); " +
                "if (!tmp.isEmpty()) { String[] rows = tmp.split(\"\\\\],\\\\s*\\\\[\"); " +
                "for (String r : rows) { r = r.replaceAll(\"^\\\\[|\\\\]$\", \"\"); " +
                "List<Long> row = new ArrayList<>(); " +
                "for (String v : r.split(\",\")) if (!v.trim().isEmpty()) row.add(Long.parseLong(v.trim())); " +
                "result.add(row); } } return result; })()";
            
            case MATRIX_STRING -> 
                "(() -> { String tmp = input.trim().substring(1, input.trim().length()-1); " +
                "List<List<String>> result = new ArrayList<>(); " +
                "if (!tmp.isEmpty()) { String[] rows = tmp.split(\"\\\\],\\\\s*\\\\[\"); " +
                "for (String r : rows) { r = r.replaceAll(\"^\\\\[|\\\\]$\", \"\"); " +
                "List<String> row = new ArrayList<>(); " +
                "for (String v : r.split(\",\")) row.add(v.trim().replaceAll(\"^\\\"|\\\"$\", \"\")); " +
                "result.add(row); } } return result; })()";
            
            default -> "input.trim()";
        };
    }


    private String generateParamParsing(Param param, int index) {
            StringBuilder code = new StringBuilder();
            code.append(String.format("        String input%d = scanner.nextLine();\n", index));
            
            DataType dt = dataTypeMap(param.type);
            String parseExpr = generateInputParsing(dt).replace("input", "input" + index);
            
            code.append(String.format("        %s %s = %s;\n", param.type, param.name, parseExpr));
            return code.toString();
        }

    private String generateMethodCall(MethodSignature signature) {
            StringBuilder code = new StringBuilder();
            
            boolean isVoid = "void".equals(signature.returnType);
            if (!isVoid) {
                code.append(String.format("        %s result = Result.%s(", signature.returnType, signature.methodName));
                for (int i = 0; i < signature.params.size(); i++) {
                    code.append(signature.params.get(i).name);
                    if (i < signature.params.size() - 1) code.append(", ");
                }
                code.append(");\n");
                code.append("        System.out.println(result);\n");
            } else {
                code.append(String.format("        Result.%s(", signature.methodName));
                for (int i = 0; i < signature.params.size(); i++) {
                    code.append(signature.params.get(i).name);
                    if (i < signature.params.size() - 1) code.append(", ");
                }
                code.append(");\n");
            }
            
            return code.toString();
        }

    @Override
     public String generateTailCode(String methodToCall) {

        MethodSignature signature = parseStarterCode(methodToCall);

        StringBuilder out = new StringBuilder();
        out.append("public class Solution {\n");
        out.append("    public static void main(String[] args) {\n");
        out.append("        Scanner scanner = new Scanner(System.in);\n\n");

        // Read and parse each parameter
        for (int i = 0; i < signature.params.size(); i++) {
            out.append(generateParamParsing(signature.params.get(i), i));
        }

        out.append("\n");

        // Call method and handle output
        out.append(generateMethodCall(signature));

        out.append("        scanner.close();\n");
        out.append("    }\n");
        out.append("}\n");

        return out.toString();
    }

    private MethodSignature parseStarterCode(String starterCode) {

        Pattern pattern = Pattern.compile(
            "(?:public|protected|private|static|final|\\s)*" +
            "([\\w<>\\[\\]]+)\\s+" +        // return type (captured)
            "([a-zA-Z_]\\w*)\\s*" +         // method name
            "\\(([^)]*)\\)"                 // params
        );
    
        Matcher matcher = pattern.matcher(starterCode);
    
        if (!matcher.find()) {
            throw new IllegalArgumentException("No method signature found");
        }
    
        String returnType = matcher.group(1);
        String methodName = matcher.group(2);
        String paramsStr = matcher.group(3).trim();
    
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
    
        return new MethodSignature(returnType, methodName, params);
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
