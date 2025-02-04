package ru.mycrg.schemas.properties;

public enum PropertyType {
    // Simple
    STRING,
    INT,
    FLOAT,
    BOOL,
    DATETIME,
    TIME,
    DURATION,
    UUID,

    // Complex
    CHOICE,
    URL,
    CALCULATED,
    GEOMETRY,
    LOOKUP,
    BINARY,
    IDENTITIES,
    SET
}
