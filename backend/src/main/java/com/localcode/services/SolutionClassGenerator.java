package com.localcode.services;

import org.springframework.stereotype.Service;

import com.localcode.dto.ExecutionRequest;
import com.localcode.dto.ProblemDetailDTO;
import com.localcode.services.Emitters.CodeEmitter;
import com.localcode.services.Emitters.EmitterFactory;

// DI figured out
@Service
public class SolutionClassGenerator {

    private final EmitterFactory emitterFactory;

    public SolutionClassGenerator(
        EmitterFactory emitterFactory
    ) {
        this.emitterFactory = emitterFactory;
    }

    public String generate(ExecutionRequest request, ProblemDetailDTO problem){

        StringBuilder innerCode = new StringBuilder();

        String problemFunction = problem.getStarterCode().get(request.getLanguage());
        CodeEmitter emitter = emitterFactory.getEmitter(request.getLanguage());

        innerCode.append(emitter.generateImports());
        innerCode.append(problemFunction); // Main needs to know what to call, probably a little tweak in wrapperclassgeneration
        innerCode.append(emitter.generateInputParsing(null)); // Need to map and send types
        innerCode.append(emitter.generateOutputParsing(null));


        String finalCode = emitter.generateWrapperClass(innerCode.toString());

        return finalCode;


    }
}