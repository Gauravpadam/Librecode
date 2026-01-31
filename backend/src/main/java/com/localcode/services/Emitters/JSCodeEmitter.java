package com.localcode.services.Emitters;
import org.springframework.stereotype.Component;
import com.localcode.persistence.entity.InputType;

@Component("JSCodeEmitter")
public class JSCodeEmitter implements CodeEmitter {

    @Override
    public String generateImports() {
        return ""; // JS usually just uses plain code for parsing
    }

    @Override
    public String generateInputParsing(InputType inputType) {
        return switch (inputType) {
            case INT -> "let parsed = parseInt(readline().trim());\n";
            case STRING -> "let parsed = readline().trim();\n";
            case ARRAY_INT -> """
                let parsed = readline().trim().slice(1, -1)
                                  .split(',')
                                  .map(s => parseInt(s.trim()));
            """;
            case ARRAY_STRING -> """
                let parsed = readline().trim().slice(1, -1)
                                  .split(',')
                                  .map(s => s.trim().replace(/^\"|\"$/g, ''));
            """;
            case MATRIX_INT -> """
                let parsed = JSON.parse(readline().trim());
            """;
            default -> "throw 'Input type not supported';\n";
        };
    }

    @Override
    public String generateOutputParsing(InputType inputType) {
        return generateInputParsing(inputType);
    }

    @Override
    public String generateWrapperClass(String innerCode) {
        return """
            function main() {
                %s
            }
            main();
            """.formatted(innerCode);
    }
}
