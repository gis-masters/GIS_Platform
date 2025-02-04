package ru.mycrg.data_service_contract.enums;

import java.util.Arrays;
import java.util.Optional;

public enum FileType {

    TAB,
    MID,
    SHP,

    DXF,
    TIF,

    GML;

    public static Optional<FileType> parse(String value) {
        if (value == null) {
            return Optional.empty();
        }

        return Arrays.stream(FileType.values())
                     .filter(type -> type.name().equalsIgnoreCase(value))
                     .findFirst();
    }
}
