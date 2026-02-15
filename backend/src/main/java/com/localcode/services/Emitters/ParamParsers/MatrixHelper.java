package com.localcode.services.Emitters.ParamParsers;



interface ProvidesMatrixHelper {
    String provideHelper();
}

class Primitive2DIntHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
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
            """;
    }
}

class Primitive2DLongHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
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
            """;
    }
}

class Primitive2DStringHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
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
            """;
    }
}

class MatrixIntHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
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
            """;
    }
}

class MatrixLongHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
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
            """;
    }
}

class MatrixStringHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
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
            """;
    }
}

class DoesNotNeedMatrixParsing implements ProvidesMatrixHelper{
    @Override
    public String provideHelper() {
        return "";
    }
}