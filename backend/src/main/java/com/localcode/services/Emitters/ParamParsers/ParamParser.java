package com.localcode.services.Emitters.ParamParsers;

public abstract class ParamParser{
    protected ProvidesMatrixHelper mh;
    protected FormatsOutput fo;

    protected ParamParser(FormatsOutput fo, ProvidesMatrixHelper mh){
        this.fo = fo;
        this.mh = mh;
    }

    public abstract String generateInputParsing();

    public String generateOutputFormatting(){
        return fo.provideOutputFormatter();
    }

    public String generateHelperMethod(){
        return mh.provideHelper();
    }

}