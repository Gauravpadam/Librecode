package com.localcode.services.Emitters;

import com.localcode.persistence.entity.InputType;

public interface CodeEmitter {
    String generateWrapperClass(String innerCode);
    String generateImports();
    String generateInputParsing(InputType inputType);
    String generateOutputParsing(InputType inputType);
}
