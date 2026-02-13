package com.localcode.services.Emitters;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.LinkedHashSet;

import com.localcode.services.MethodSignature;
import org.springframework.stereotype.Component;

import com.localcode.services.Param;
import com.localcode.services.TailCodeGenerationUtils;
import com.localcode.services.DataType;

// TODO: A bigger refactor would be needed, this could be harness builder and then I could implement some strategies for it.
// TODO: Handle empty inputs. - DONE
// TDOD: Handle cases where custom types are present (TreeNode etc.)

@Component("JavaCodeEmitter")
public class JavaCodeEmitter implements CodeEmitter{


    


    private String generateParamParsing(Param param, int index) {
            StringBuilder code = new StringBuilder();
            code.append(String.format("        String input%d = scanner.hasNextLine() ? scanner.nextLine() : \"\";\n", index));
            
            DataType dt = TailCodeGenerationUtils.dataTypeMap(param.type);
            String parseExpr = TailCodeGenerationUtils.generateInputParsing(dt).replace("input", "input" + index);
            
            code.append(String.format("        %s %s = %s;\n", param.type, param.name, parseExpr));
            return code.toString();
        }
    
    
    // TODO: Implementation of call by reference
    // There is one crink here. If the problem says modify in place, we need to pass by reference in the method call.

    
    private String generateMethodCall(MethodSignature signature) {
            StringBuilder code = new StringBuilder();
            
            // void vs normal returntype
            boolean isVoid = "void".equals(signature.returnType);
            if (!isVoid) {
                code.append("Result result = new Result();");
                code.append(String.format("        %s res = result.%s(", signature.returnType, signature.methodName));
                for (int i = 0; i < signature.params.size(); i++) {
                    code.append(signature.params.get(i).name);
                    if (i < signature.params.size() - 1) code.append(", ");
                }

                code.append(");\n");
            } else {
                code.append("           Result result = new Result();");
                code.append(String.format("        result.%s(", signature.methodName));
                for (int i = 0; i < signature.params.size(); i++) {
                    code.append(signature.params.get(i).name);
                    if (i < signature.params.size() - 1) code.append(", ");
                }
                code.append(");\n");
            }
            
            return code.toString();
        }



    private Set<DataType> findNeededMatrixParsingHelpers(MethodSignature signature){
        // Collect types that need helper methods
        Set<DataType> neededHelpers = new LinkedHashSet<>();
        for (Param p : signature.params) {
            DataType dt = TailCodeGenerationUtils.dataTypeMap(p.type);
            if (dt == DataType.ARRAY_2D_INT || dt == DataType.ARRAY_2D_LONG || dt == DataType.ARRAY_2D_STRING
                || dt == DataType.MATRIX_INT || dt == DataType.MATRIX_LONG || dt == DataType.MATRIX_STRING) {
                neededHelpers.add(dt);
            }
        }

        return neededHelpers;
    }

    private String addMatrixParsingHelpers(MethodSignature signature){
        Set<DataType> neededHelpers = findNeededMatrixParsingHelpers(signature);

        StringBuilder matrixParsers = new StringBuilder();

         // Generate helper methods if needed
        if (!neededHelpers.isEmpty()) {
            matrixParsers.append(TailCodeGenerationUtils.generateHelperMethods(new ArrayList<>(neededHelpers)));
        }

        return matrixParsers.toString();
    }

    // start main
        // declarations*
        // scanner
        // input parsers
        // method call*
        // output parsing
    

    private String addInputParsers(List<Param> params){

        StringBuilder inputParsers = new StringBuilder();

             // Read and parse each parameter
        for (int i = 0; i < params.size(); i++) {
            inputParsers.append(generateParamParsing(params.get(i), i));
        }

        return inputParsers.toString();
    }

    private String addMainMethod(MethodSignature signature){
        StringBuilder mainMethod = new StringBuilder();
        mainMethod.append("    public static void main(String[] args) {\n");
        mainMethod.append("        Scanner scanner = new Scanner(System.in);\n\n");


        // Input parsers
        mainMethod.append(addInputParsers(signature.params));

        // clean code go brrrrrr
        mainMethod.append("\n");

        // Call method and handle output
        mainMethod.append(generateMethodCall(signature));

        // handle output
        mainMethod.append(TailCodeGenerationUtils.generateOutputParsing(TailCodeGenerationUtils.dataTypeMap(signature.returnType)));

        mainMethod.append("        scanner.close();\n");
        mainMethod.append("    }\n");

        return mainMethod.toString();
    }

    // public clsas Solution {
        // helper methods
        // custom datatype classes*
            // start main
                // declarations*
                // scanner
                // input parsers
                // method call*
                // output parsing
            // end main
    // }
    @Override
    public String generateTailCode(String methodToCall) {


        MethodSignature signature = TailCodeGenerationUtils.parseStarterCode(methodToCall);


        StringBuilder out = new StringBuilder();
        out.append("public class Solution {\n");

        // Matrix parsing helpers
        out.append(addMatrixParsingHelpers(signature));

        // main function
        out.append(addMainMethod(signature));

        return out.toString();
    }

    

    
}
