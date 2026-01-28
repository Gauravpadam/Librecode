package com.localcode.services.Emitters;

import org.springframework.stereotype.Component;
import com.localcode.persistence.entity.InputType;


@Component("PythonCodeEmitter")
public class PythonCodeEmitter implements CodeEmitter {

    @Override
    public String generateImports() {
        return ""; // Python often doesn't need standard imports for simple input parsing
    }

    @Override
    public String generateInputParsing(InputType inputType) {
        return switch (inputType) {
            case INT -> "parsed = int(input().strip())\n";
            case STRING -> "parsed = input().strip()\n";
            case ARRAY_INT -> "parsed = list(map(int, input().strip()[1:-1].split(',')))\n";
            case ARRAY_STRING -> "parsed = [s.strip().strip('\"') for s in input().strip()[1:-1].split(',')]\n";
            case MATRIX_INT -> """
                import ast
                parsed = ast.literal_eval(input().strip())
            """;
            default -> "raise Exception('Input type not supported')\n";
        };
    }

    @Override
    public String generateOutputParsing(InputType inputType) {
        // For now input & output parsing is symmetric
        return generateInputParsing(inputType);
    }

    @Override
    public String generateWrapperClass(String innerCode) {
        return """
            def main():
                %s

            if __name__ == "__main__":
                main()
            """.formatted(innerCode);
    }
}
