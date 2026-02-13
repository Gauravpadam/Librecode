package com.localcode.services;
import java.util.List;

public interface TailCodeGenerationStrategy {
    
    String addDeclarations(List<Param> params);
    String addCustomDataTypeClasses(List<Param> params);
    String generateMethodCall(String methodName, List<Param> params);

}
