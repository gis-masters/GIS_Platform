package ru.mycrg.data_service.service.smev3.support_classes;

import org.jetbrains.annotations.NotNull;

public class Mnemonic {

    @NotNull
    public static String id(@NotNull String mnemonic, @NotNull String version) {
        return String.format("%s-%s", mnemonic, version);
    }
}
