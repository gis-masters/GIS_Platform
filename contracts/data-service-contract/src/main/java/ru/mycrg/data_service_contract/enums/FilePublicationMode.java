package ru.mycrg.data_service_contract.enums;

import java.util.Arrays;
import java.util.Optional;

public enum FilePublicationMode {
    FULL,
    GIS,
    GEOSERVER;

    public static Optional<FilePublicationMode> parse(String value) {
        if (value == null) {
            return Optional.empty();
        }

        return Arrays.stream(FilePublicationMode.values())
                     .filter(mode -> mode.name().equalsIgnoreCase(value))
                     .findFirst();
    }
}
