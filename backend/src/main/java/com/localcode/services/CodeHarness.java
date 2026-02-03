package com.localcode.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.localcode.dto.ExecutionRequest;
import com.localcode.dto.ProblemDetailDTO;
import com.localcode.services.Emitters.CodeEmitter;
import com.localcode.services.Emitters.EmitterFactory;

// DI figured out
@Service
public class CodeHarness {

    private final EmitterFactory emitterFactory;

    public CodeHarness(
        EmitterFactory emitterFactory
    ) {
        this.emitterFactory = emitterFactory;
    }

    public String generate(ExecutionRequest request, ProblemDetailDTO problem){

        StringBuilder harness = new StringBuilder();

        String problemFunction = problem.getStarterCode().get(request.getLanguage());
        String problemInputType = problem.getInputType();
        CodeEmitter emitter = emitterFactory.getEmitter(request.getLanguage());


        String inputParser = emitter.generateInputParsing(null);
        String outputParser = emitter.generateOutputParsing(null);
        String head =emitter.generateImports();
        String tail = emitter.generateTail()

        harness.append(emitter.generateOutputParsing(null));


        String finalCode = emitter.g(innerCode.toString());

        return finalCode;
    }
}