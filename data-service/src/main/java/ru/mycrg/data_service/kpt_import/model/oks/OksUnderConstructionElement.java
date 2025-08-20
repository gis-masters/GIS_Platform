package ru.mycrg.data_service.kpt_import.model.oks;

import ru.mycrg.data_service.kpt_import.model.KptElement;

import java.util.Map;

public class OksUnderConstructionElement extends KptElement {

    public static String XML_TAG = "object_under_construction_record";

    public OksUnderConstructionElement(Map<String, Object> content) {
        super(content);
    }
}
