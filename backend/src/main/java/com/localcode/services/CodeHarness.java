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

        CodeEmitter emitter = emitterFactory.getEmitter(request.getLanguage());
        StringBuilder harness = new StringBuilder();

        harness.append(emitter.generateImports());
        harness.append(emitter.generateTailCode(problem.getStarterCode().get(request.getLanguage())));

        return harness.toString();
    }
}