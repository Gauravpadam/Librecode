package com.localcode.services.Emitters;

import org.springframework.stereotype.Component;
import com.localcode.services.DataType;
import com.localcode.services.MethodSignature;
import com.localcode.services.Param;
import java.util.List;
import java.util.ArrayList;
import java.util.regex.*;

@Component("PythonCodeEmitter")
public class PythonCodeEmitter implements CodeEmitter {

    @Override
    public DataType dataTypeMap(String paramType) {
        return switch (paramType) {
            case "int" -> DataType.INT;
            case "float" -> DataType.DOUBLE;
            case "str" -> DataType.STRING;
            case "bool" -> DataType.BOOLEAN;
            case "List[int]" -> DataType.LIST_INT;
            case "list[int]" -> DataType.LIST_INT;
            case "List[float]" -> DataType.LIST_DOUBLE;
            case "list[float]" -> DataType.LIST_DOUBLE;
            case "List[str]" -> DataType.LIST_STRING;
            case "list[str]" -> DataType.LIST_STRING;
            case "List[List[int]]" -> DataType.MATRIX_INT;
            case "list[list[int]]" -> DataType.MATRIX_INT;
            case "List[List[str]]" -> DataType.MATRIX_STRING;
            case "list[list[str]]" -> DataType.MATRIX_STRING;
            default -> throw new IllegalArgumentException("Unknown Python type: " + paramType);
        };
    }

    @Override
    public String generateImports() {
        return "from typing import List\n";
    }

    @Override
    public String generateInputParsing(DataType dataType) {
        return switch (dataType) {
            case INT -> "int(input_val.strip())";
            case LONG -> "int(input_val.strip())";
            case DOUBLE, FLOAT -> "float(input_val.strip())";
            case BOOLEAN -> "input_val.strip().lower() == 'true'";
            case CHAR -> "input_val.strip()[0]";
            case STRING -> "input_val.strip()";
            
            case ARRAY_INT, LIST_INT -> 
                "list(map(int, [s.strip() for s in input_val.strip()[1:-1].split(',') if s.strip()]))";
            
            case ARRAY_LONG, LIST_LONG -> 
                "list(map(int, [s.strip() for s in input_val.strip()[1:-1].split(',') if s.strip()]))";
            
            case ARRAY_DOUBLE, LIST_DOUBLE -> 
                "list(map(float, [s.strip() for s in input_val.strip()[1:-1].split(',') if s.strip()]))";
            
            case ARRAY_STRING, LIST_STRING -> 
                "[s.strip().strip('\"') for s in input_val.strip()[1:-1].split(',')]";
            
            case MATRIX_INT -> 
                "(lambda: (lambda tmp: [[int(v.strip()) for v in r.strip('[]').split(',') if v.strip()] " +
                "for r in tmp.split('],') if r.strip()])(input_val.strip()[1:-1] if input_val.strip() else ''))()";
            
            case MATRIX_LONG -> 
                "(lambda: (lambda tmp: [[int(v.strip()) for v in r.strip('[]').split(',') if v.strip()] " +
                "for r in tmp.split('],') if r.strip()])(input_val.strip()[1:-1] if input_val.strip() else ''))()";
            
            case MATRIX_STRING -> 
                "(lambda: (lambda tmp: [[v.strip().strip('\"') for v in r.strip('[]').split(',')] " +
                "for r in tmp.split('],') if r.strip()])(input_val.strip()[1:-1] if input_val.strip() else ''))()";
            
            default -> "input_val.strip()";
        };
    }

    private String generateParamParsing(Param param, int index) {
        StringBuilder code = new StringBuilder();
        code.append(String.format("    input_val%d = input()\n", index));
        
        DataType dt = dataTypeMap(param.type);
        String parseExpr = generateInputParsing(dt).replace("input_val", "input_val" + index);
        
        code.append(String.format("    %s = %s\n", param.name, parseExpr));
        return code.toString();
    }

    private String generateMethodCall(MethodSignature signature) {
        StringBuilder code = new StringBuilder();
        
        code.append(String.format("    result = %s(", signature.methodName));
        for (int i = 0; i < signature.params.size(); i++) {
            code.append(signature.params.get(i).name);
            if (i < signature.params.size() - 1) code.append(", ");
        }
        code.append(")\n");
        code.append("    print(result)\n");
        
        return code.toString();
    }

    @Override
    public String generateTailCode(String methodToCall) {
        MethodSignature signature = parseStarterCode(methodToCall);

        StringBuilder out = new StringBuilder();
        out.append("def main():\n");

        // Read and parse each parameter
        for (int i = 0; i < signature.params.size(); i++) {
            out.append(generateParamParsing(signature.params.get(i), i));
        }

        out.append("\n");
        
        // Call method and handle output
        out.append(generateMethodCall(signature));

        out.append("\nif __name__ == '__main__':\n");
        out.append("    main()\n");

        return out.toString();
    }

    private MethodSignature parseStarterCode(String starterCode) {
        Pattern pattern = Pattern.compile(
            "def\\s+" +
            "([a-zA-Z_]\\w*)\\s*" +         // function name
            "\\(([^)]*)\\)" +               // params
            "(?:\\s*->\\s*([\\w\\[\\],\\s]+))?"  // optional return type
        );
    
        Matcher matcher = pattern.matcher(starterCode);
    
        if (!matcher.find()) {
            throw new IllegalArgumentException("No function signature found");
        }
    
        String methodName = matcher.group(1);
        String paramsStr = matcher.group(2).trim();
        String returnType = matcher.group(3) != null ? matcher.group(3).trim() : "None";
    
        List<Param> params = new ArrayList<>();
    
        if (!paramsStr.isEmpty()) {
            String[] paramParts = paramsStr.split(",");
            for (String param : paramParts) {
                extractParam(param.trim(), params);
            }
        }
    
        return new MethodSignature(returnType, methodName, params);
    }

    private void extractParam(String raw, List<Param> params) {
        String param = raw.trim();
        // Python params: name or name: type
        if (param.contains(":")) {
            String[] parts = param.split(":", 2);
            String name = parts[0].trim();
            String type = parts[1].trim();
            params.add(new Param(type, name));
        } else {
            params.add(new Param("Any", param));
        }
    }
}
