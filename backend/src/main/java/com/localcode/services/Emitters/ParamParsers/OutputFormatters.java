package com.localcode.services.Emitters.ParamParsers;

interface FormatsOutput{
    String provideOutputFormatter();
}


class Primitive1DNumLikeArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.println(Arrays.toString(res).replace(" ", ""));
            """;
    }
}

class Primitive1DCharArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.println(Arrays.toString(res).replace(" ", ""));
            """;
    } 
}

class Primitive1DStringArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.print("[");
                for (int i = 0; i < res.length; i++) {
                    System.out.print("\\\"" + res[i] + "\\\"");
                    if (i != res.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;
    }
}

class Primitive2DNumLikeArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.print("[");
                for (int i = 0; i < res.length; i++) {
                    System.out.print(Arrays.toString(res[i]).replace(" ", ""));
                    if (i != res.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;
    }
}

class Primitive2DStringArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return  """
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
    }
}

class MatrixFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.println(res.toString().replace(" ", ""));\n";
            """;
    }
}

class NumLikeListFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.println(res.toString().replace(" ", ""));\n";
            """;
    }
}

class StringListFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.print("[");
                for (int i = 0; i < res.size(); i++) {
                    System.out.print("\\\"" + res.get(i) + "\\\"");
                    if (i != res.size() - 1) System.out.print(",");
                }
                System.out.println("]");
            """;
    }
}

class DirectDisplayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return "System.out.println(res);\n";
    }
}