package com.localcode.services;

import org.springframework.stereotype.Service;

import com.localcode.dto.ProblemDetailDTO;

// Same, this will have a DI as well for different languages
@Service
public class ParsingCodeGenerator {

    /* =======================
       Public API
       ======================= */

    public String getInputParserCode(ParseType type, String variableName) {
        return switch (type) {
            case INT -> intParser(variableName);
            case STRING -> stringParser(variableName);
            case ARRAY_INT -> intArrayParser(variableName);
            case ARRAY_STRING -> stringArrayParser(variableName);
            case MATRIX_INT -> intMatrixParser(variableName);
            default -> unsupportedParser();
        };
    }

    public String getImports(ParseType type) {
            return switch (type) {
                case ARRAY_INT, ARRAY_STRING, MATRIX_INT -> "import java.util.*;\nimport java.util.stream.*;\n";
                default -> "";
            };
        }



    public String getOutputParserCode(ParseType type, String variableName) {
        // For now input & output parsing is symmetric
        return getInputParserCode(type, variableName);
    }

    public ParseType parseInputType(ProblemDetailDTO problem) {
        return mapType(problem.getInputType());
    }

    public ParseType parseOutputType(ProblemDetailDTO problem) {
        return mapType(problem.getOutputType());
    }

    /* =======================
       Type Mapping
       ======================= */

    private ParseType mapType(String rawType) {
        if (rawType == null) return ParseType.NOT_SUPPORTED;

        return switch (rawType.trim().toUpperCase()) {
            case "INT" -> ParseType.INT;
            case "STRING" -> ParseType.STRING;
            case "ARRAY_INT", "INT_ARRAY", "ARRAY" -> ParseType.ARRAY_INT;
            case "ARRAY_STRING" -> ParseType.ARRAY_STRING;
            case "MATRIX_INT", "INT_MATRIX" -> ParseType.MATRIX_INT;
            default -> ParseType.NOT_SUPPORTED;
        };
    }

    /* =======================
       Generator Code
       ======================= */

    private String intParser(String var) {
        return "int %s = Integer.parseInt(input.trim());\n".formatted(var);
    }

    private String stringParser(String var) {
        return "String %s = input.trim()\n".formatted(var);
    }

    private String intArrayParser(String var) {
        return """
        List<Integer> %s = Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))
                              .map(String::trim)
                              .map(Integer::parseInt)
                              .collect(Collectors.toList());
        """.formatted(var);
    }

    private String stringArrayParser(String var) {
        return """
        List<String> %s = Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))
                                 .map(String::trim)
                                 .map(s -> s.replaceAll(\"^\\\\\"|\\\\\"$\", \"\"))
                                 .collect(Collectors.toList());
        """.formatted(var);
    }

    private String intMatrixParser(String var) {
        return """
            String cleaned = input.trim().substring(1, input.length()-1);
                    List<List<Integer>> %s = new ArrayList<>();
                    int depth = 0;
                    StringBuilder current = new StringBuilder();
                    for (char c : cleaned.toCharArray()) {
                        if (c == '[') depth++;
                        if (c == ']') depth--;
                        current.append(c);
                        if (depth == 0 && c == ']') {
                            %s.add(parseRow(current.toString()));
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
        """.formatted(var);
    }

    private String unsupportedParser() {
        return """
            throw new UnsupportedOperationException(\"Input type not supported\");
        """;
    }

    public enum ParseType {
        INT,
        STRING,
        ARRAY_INT,
        ARRAY_STRING,
        MATRIX_INT,
        NOT_SUPPORTED
    }

}
