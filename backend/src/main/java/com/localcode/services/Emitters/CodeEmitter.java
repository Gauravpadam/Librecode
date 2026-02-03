package com.localcode.services.Emitters;


public interface CodeEmitter {
    String generateTailCode(String methodToCall);
    String generateImports();
    String generateInputParsing(Object dataType);
}
