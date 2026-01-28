package com.localcode.services;

import org.springframework.stereotype.Service;

import com.localcode.dto.ExecutionRequest;
import com.localcode.dto.ProblemDetailDTO;

// Ideally I need to perform a DI here which I'm not able to see atm.
// Will do as it comes.
// Also the buider pattern is broken.
@Service
public class SolutionClassGenerator {

    private final ParsingCodeGenerator parsingCodeGenerator;
    StringBuilder sb = new StringBuilder();

    public SolutionClassGenerator(ParsingCodeGenerator parsingCodeGenerator) {
        this.parsingCodeGenerator = parsingCodeGenerator;
    }

    public String build(){
        return sb.toString();
    }

    public void addStarterCode(ProblemDetailDTO problem, ExecutionRequest executionRequest){
        String starterCode = problem.getStarterCode().get(executionRequest.getLanguage());
        sb.append(starterCode);
    }

    public void addImports(ProblemDetailDTO problem){
        String imports = parsingCodeGenerator.getImports(parsingCodeGenerator.parseInputType(problem));
        imports += parsingCodeGenerator.getImports(parsingCodeGenerator.parseInputType(problem));

        sb.append(imports);
    }

    public void addScanner(){
        sb.append("Scanner sc = new Scanner(System.in);\n String input = sc.nextLine();");
    }


    public void addInputParsing(ProblemDetailDTO problem){
        String parser = parsingCodeGenerator.getInputParserCode(parsingCodeGenerator.parseInputType(problem), "parsed");
        sb.append(parser);
    }

    public void addOutputParsing(ProblemDetailDTO problem){
        String parser = parsingCodeGenerator.getOutputParserCode(parsingCodeGenerator.parseOutputType(problem), "result");
        sb.append(parser);
    }

    
    
}