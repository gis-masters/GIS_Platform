package ru.mycrg.data_service.kpt_import;

public class CadastralNumberExtractor {

    private static String CADASTRAL_NUM_SEPARATOR = ":";

    public static String extractNumberFromCadastralNum(String cadastralnum) {
        var parts = cadastralnum.split(CADASTRAL_NUM_SEPARATOR);
        return parts[parts.length - 1];
    }
}
