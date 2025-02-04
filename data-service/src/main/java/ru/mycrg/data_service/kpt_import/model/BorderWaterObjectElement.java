package ru.mycrg.data_service.kpt_import.model;

import java.util.Map;

public class BorderWaterObjectElement extends KptElement {

    public static String XML_TAG = "coastline_record";

    public BorderWaterObjectElement(Map<String, Object> content) {
        super(content);
    }
}
