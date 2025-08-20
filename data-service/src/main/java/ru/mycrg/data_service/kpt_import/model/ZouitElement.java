package ru.mycrg.data_service.kpt_import.model;

import java.util.Map;

public class ZouitElement extends KptElement{
    public static String XML_TAG = "zones_and_territories_record";

    public ZouitElement(Map<String, Object> content) {
        super(content);
    }
}
