package ru.mycrg.data_service.kpt_import.model.oks;

import ru.mycrg.data_service.kpt_import.model.KptElement;

import java.util.Map;

public class OksConstructionElement extends KptElement {

    public static String XML_TAG = "construction_record";

    public OksConstructionElement(Map<String, Object> content) {
        super(content);
    }
}
