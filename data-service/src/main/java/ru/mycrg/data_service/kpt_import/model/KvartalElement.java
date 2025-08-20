package ru.mycrg.data_service.kpt_import.model;

import java.util.Map;

public class KvartalElement extends KptElement {

    public static String XML_TAG = "cadastral_block";

    public KvartalElement(Map<String, Object> content) {
        super(content);
    }
}
