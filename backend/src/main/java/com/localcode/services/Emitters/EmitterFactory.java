package com.localcode.services.Emitters;

import org.springframework.stereotype.Service;

@Service
public class EmitterFactory {
    private final PythonCodeEmitter pythonCodeEmitter;
    private final JSCodeEmitter jsCodeEmitter;
    private final JavaCodeEmitter javaCodeEmitter;

    public EmitterFactory(PythonCodeEmitter pythonCodeEmitter, JSCodeEmitter jsCodeEmitter, JavaCodeEmitter javaCodeEmitter) {
        this.pythonCodeEmitter = pythonCodeEmitter;
        this.jsCodeEmitter = jsCodeEmitter;
        this.javaCodeEmitter = javaCodeEmitter;
    }

    public CodeEmitter getEmitter(String language) {
        return switch (language.toLowerCase()) {
            case "java" -> javaCodeEmitter;
            case "python" -> pythonCodeEmitter;
            case "javascript", "js" -> jsCodeEmitter;
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }
}
