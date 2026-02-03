package com.localcode.services;

public class DataType{

    public enum JavaDataType{
         // primitives
    INT,
    LONG,
    DOUBLE,
    FLOAT,
    BOOLEAN,
    CHAR,

    // simple objects
    STRING,

    // arrays
    ARRAY_INT,
    ARRAY_LONG,
    ARRAY_DOUBLE,
    ARRAY_STRING,

    // collections
    LIST_INT,
    LIST_LONG,
    LIST_DOUBLE,
    LIST_STRING,

    // matrix / 2D
    MATRIX_INT,
    MATRIX_LONG,
    MATRIX_STRING,

    // fallback
    UNKNOWN
    }
}