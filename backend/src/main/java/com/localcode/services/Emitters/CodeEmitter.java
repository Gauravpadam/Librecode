package com.localcode.services.Emitters;
import com.localcode.services.DataType;

public interface CodeEmitter {
    String generateImports();
    String generateTailCode(String methodToCall);
    String generateInputParsing(DataType dataType);
    DataType dataTypeMap(String paramType);

}
