package ru.mycrg.data_service.service.smev3.model;

import org.jetbrains.annotations.Nullable;

import java.util.Arrays;

public enum SmevMessageType {
    REJECT("RejectMessage"),
    STATUS("StatusMessage"),
    PRIMARY("PrimaryMessage");

    private final String smevValue;

    SmevMessageType(String smevValue) {
        this.smevValue = smevValue;
    }

    public String getSmevValue() {
        return smevValue;
    }

    @Nullable
    public static SmevMessageType parseFromSmevValue(String value) {
        if (value == null) {
            return null;
        }

        return Arrays.stream(SmevMessageType.values())
                     .filter(type -> type.getSmevValue().equals(value))
                     .findFirst()
                     .orElse(null);
    }
}
