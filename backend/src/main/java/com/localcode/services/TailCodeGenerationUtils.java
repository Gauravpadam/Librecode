package com.localcode.services;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public final class TailCodeGenerationUtils {

    private TailCodeGenerationUtils() {
    }

    public static DataType dataTypeMap(String paramType) {
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
            case "char[]" -> DataType.ARRAY_CHAR;

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

            // 2D primitive arrays
            case "int[][]" -> DataType.ARRAY_2D_INT;
            case "long[][]" -> DataType.ARRAY_2D_LONG;
            case "String[][]" -> DataType.ARRAY_2D_STRING;

            // matrices (List<List<...>>)
            case "List<List<Integer>>" -> DataType.MATRIX_INT;
            case "ArrayList<List<Integer>>" -> DataType.MATRIX_INT;
            case "List<List<Long>>" -> DataType.MATRIX_LONG;
            case "ArrayList<List<Long>>" -> DataType.MATRIX_LONG;
            case "List<List<String>>" -> DataType.MATRIX_STRING;
            case "ArrayList<List<String>>" -> DataType.MATRIX_STRING;

            default -> throw new IllegalArgumentException("Unknown Java type: " + paramType);
        };
    }

    public static String generateImports() {
        return "import java.util.*;\nimport java.util.stream.*;\n";
    }

    public static String generateInputParsing(DataType javaDataType) {
        return switch (javaDataType) {
            case INT -> "Integer.parseInt(input.trim())";
            case LONG -> "Long.parseLong(input.trim())";
            case DOUBLE -> "Double.parseDouble(input.trim())";
            case FLOAT -> "Float.parseFloat(input.trim())";
            case BOOLEAN -> "Boolean.parseBoolean(input.trim())";
            case CHAR -> "input.trim().charAt(0)";
            case STRING -> "input.trim()";

            // primitive arrays -> return primitive array types
            case ARRAY_INT -> "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                    + ".map(String::trim).filter(stringz->!stringz.isEmpty()).mapToInt(Integer::parseInt).toArray()";

            case ARRAY_LONG -> "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                    + ".map(String::trim).filter(stringz->!stringz.isEmpty()).mapToLong(Long::parseLong).toArray()";

            case ARRAY_DOUBLE -> "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                    + ".map(String::trim).filter(stringz->!stringz.isEmpty()).mapToDouble(Double::parseDouble).toArray()";

            case ARRAY_STRING -> "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                    + ".map(String::trim).map(stringz->stringz.replaceAll(\"^\\\\\"|\\\\\"$\", \"\")).toArray(String[]::new)";

            case ARRAY_CHAR -> "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                    + ".map(String::trim).map(stringz->stringz.replaceAll(\"^\\\\\"|\\\\\"$\", \"\")).toArray(char[]::new)";
            // list variants -> keep returning collections
            case LIST_INT -> "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                    + ".map(String::trim).filter(s->!s.isEmpty()).map(Integer::parseInt).collect(Collectors.toList())";

            case LIST_LONG -> "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                    + ".map(String::trim).filter(s->!s.isEmpty()).map(Long::parseLong).collect(Collectors.toList())";

            case LIST_DOUBLE -> "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                    + ".map(String::trim).filter(s->!s.isEmpty()).map(Double::parseDouble).collect(Collectors.toList())";

            case LIST_STRING -> "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                    + ".map(String::trim).map(s->s.replaceAll(\"^\\\\\"|\\\\\"$\", \"\")).collect(Collectors.toList())";

            case ARRAY_2D_INT -> "parseIntArray2D(input)";
            case ARRAY_2D_LONG -> "parseLongArray2D(input)";
            case ARRAY_2D_STRING -> "parseStringArray2D(input)";
            case MATRIX_INT -> "parseIntMatrix(input)";
            case MATRIX_LONG -> "parseLongMatrix(input)";
            case MATRIX_STRING -> "parseStringMatrix(input)";

            default -> "input.trim()";
        };
    }

    public static String generateHelperMethods(List<DataType> neededTypes) {
        StringBuilder helpers = new StringBuilder();

        for (DataType dt : neededTypes) {
            switch (dt) {
                case ARRAY_2D_INT -> helpers.append("""
                        private static int[][] parseIntArray2D(String input) {
                            String tmp = input.trim().substring(1, input.trim().length() - 1);
                            List<int[]> rows = new ArrayList<>();
                            if (!tmp.isEmpty()) {
                                String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                                for (String r : parts) {
                                    r = r.replaceAll("^\\\\[|\\\\]$", "");
                                    rows.add(Arrays.stream(r.split(","))
                                        .map(String::trim)
                                        .filter(s -> !s.isEmpty())
                                        .mapToInt(Integer::parseInt)
                                        .toArray());
                                }
                            }
                            return rows.toArray(new int[0][]);
                        }
                    """);
                case ARRAY_2D_LONG -> helpers.append("""
                        private static long[][] parseLongArray2D(String input) {
                            String tmp = input.trim().substring(1, input.trim().length() - 1);
                            List<long[]> rows = new ArrayList<>();
                            if (!tmp.isEmpty()) {
                                String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                                for (String r : parts) {
                                    r = r.replaceAll("^\\\\[|\\\\]$", "");
                                    rows.add(Arrays.stream(r.split(","))
                                        .map(String::trim)
                                        .filter(s -> !s.isEmpty())
                                        .mapToLong(Long::parseLong)
                                        .toArray());
                                }
                            }
                            return rows.toArray(new long[0][]);
                        }
                    """);
                case ARRAY_2D_STRING -> helpers.append("""
                        private static String[][] parseStringArray2D(String input) {
                            String tmp = input.trim().substring(1, input.trim().length() - 1);
                            List<String[]> rows = new ArrayList<>();
                            if (!tmp.isEmpty()) {
                                String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                                for (String r : parts) {
                                    r = r.replaceAll("^\\\\[|\\\\]$", "");
                                    rows.add(Arrays.stream(r.split(","))
                                        .map(String::trim)
                                        .map(s -> s.replaceAll("^\\\"|\\\"$", ""))
                                        .toArray(String[]::new));
                                }
                            }
                            return rows.toArray(new String[0][]);
                        }
                    """);
                case MATRIX_INT -> helpers.append("""
                        private static List<List<Integer>> parseIntMatrix(String input) {
                            String tmp = input.trim().substring(1, input.trim().length() - 1);
                            List<List<Integer>> result = new ArrayList<>();
                            if (!tmp.isEmpty()) {
                                String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                                for (String r : parts) {
                                    r = r.replaceAll("^\\\\[|\\\\]$", "");
                                    List<Integer> row = new ArrayList<>();
                                    for (String v : r.split(",")) {
                                        if (!v.trim().isEmpty()) row.add(Integer.parseInt(v.trim()));
                                    }
                                    result.add(row);
                                }
                            }
                            return result;
                        }
                    """);
                case MATRIX_LONG -> helpers.append("""
                        private static List<List<Long>> parseLongMatrix(String input) {
                            String tmp = input.trim().substring(1, input.trim().length() - 1);
                            List<List<Long>> result = new ArrayList<>();
                            if (!tmp.isEmpty()) {
                                String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                                for (String r : parts) {
                                    r = r.replaceAll("^\\\\[|\\\\]$", "");
                                    List<Long> row = new ArrayList<>();
                                    for (String v : r.split(",")) {
                                        if (!v.trim().isEmpty()) row.add(Long.parseLong(v.trim()));
                                    }
                                    result.add(row);
                                }
                            }
                            return result;
                        }
                    """);
                case MATRIX_STRING -> helpers.append("""
                        private static List<List<String>> parseStringMatrix(String input) {
                            String tmp = input.trim().substring(1, input.trim().length() - 1);
                            List<List<String>> result = new ArrayList<>();
                            if (!tmp.isEmpty()) {
                                String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                                for (String r : parts) {
                                    r = r.replaceAll("^\\\\[|\\\\]$", "");
                                    List<String> row = new ArrayList<>();
                                    for (String v : r.split(",")) {
                                        row.add(v.trim().replaceAll("^\\\"|\\\"$", ""));
                                    }
                                    result.add(row);
                                }
                            }
                            return result;
                        }
                    """);
                default -> {
                } // No helper needed
            }
        }
        return helpers.toString();
    }

    public static String generateOutputParsing(DataType returnType) {
        return switch (returnType) {
            case ARRAY_INT, ARRAY_LONG, ARRAY_DOUBLE, ARRAY_CHAR ->
                "        System.out.println(Arrays.toString(res).replace(\" \", \"\"));\n";

            case ARRAY_2D_INT, ARRAY_2D_LONG -> """
                System.out.print("[");
                for (int i = 0; i < res.length; i++) {
                    System.out.print(Arrays.toString(res[i]).replace(" ", ""));
                    if (i != res.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;

            case ARRAY_2D_STRING -> """
                System.out.print("[");
                for (int i = 0; i < res.length; i++) {
                    System.out.print("[");
                    for (int j = 0; j < res[i].length; j++) {
                        System.out.print("\\\"" + res[i][j] + "\\\"");
                        if (j != res[i].length - 1) System.out.print(",");
                    }
                    System.out.print("]");
                    if (i != res.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;

            case ARRAY_STRING -> """
                System.out.print("[");
                for (int i = 0; i < res.length; i++) {
                    System.out.print("\\\"" + res[i] + "\\\"");
                    if (i != res.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;

            case LIST_STRING -> """
                System.out.print("[");
                for (int i = 0; i < res.size(); i++) {
                    System.out.print("\\\"" + res.get(i) + "\\\"");
                    if (i != res.size() - 1) System.out.print(",");
                }
                System.out.println("]");
            """;

            case LIST_INT, LIST_LONG, LIST_DOUBLE, MATRIX_INT, MATRIX_LONG, MATRIX_STRING ->
                "        System.out.println(res.toString().replace(\" \", \"\"));\n";

            default -> "        System.out.println(res);\n";
        };
    }

    public static MethodSignature parseStarterCode(String starterCode) {

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

    private static void extractParam(String raw, List<Param> params) {
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