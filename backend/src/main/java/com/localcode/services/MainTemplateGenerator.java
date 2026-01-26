package com.localcode.services;

import org.springframework.stereotype.Service;

import com.localcode.dto.ProblemDetailDTO;
import com.localcode.services.ParsingCodeGenerator;

@Service
public class MainTemplateGenerator {

    private final ParsingCodeGenerator parsingCodeGenerator;
    private String MainTemplate = "";

    public String build(){
        return MainTemplate;
    }

    public String addImports(ProblemDetailDTO problem){
        String imports = parsingCodeGenerator.getImports(parsingCodeGenerator.parseInputType(problem));
        imports += parsingCodeGenerator.getImports(parsingCodeGenerator.parseOutputType(problem));
        MainTemplate += imports + "\n";
        return this;
    }
    
}
