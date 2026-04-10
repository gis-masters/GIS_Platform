package ru.mycrg.common_contracts.enums;

import java.io.Serializable;

public enum GpkgContentsDataType implements Serializable {
    FEATURES("features"),
    TILES("tiles"),
    ATTRIBUTES("attributes");

    private final String dataType;

    GpkgContentsDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getDataTypeAsString() {
        return this.dataType;
    }

    public static GpkgContentsDataType stringToGpkgContentsDataType(String dataType) {
        if (dataType == null) {
            throw new IllegalArgumentException("dataType не может быть null");
        }

        for (GpkgContentsDataType type: GpkgContentsDataType.values()) {
            if (type.name().equalsIgnoreCase(dataType)) {
                return type;
            }
        }

        throw new IllegalArgumentException("Неожиданный тип данных '" + dataType + "'");
    }
}
