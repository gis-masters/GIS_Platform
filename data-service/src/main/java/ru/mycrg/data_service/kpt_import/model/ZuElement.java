package ru.mycrg.data_service.kpt_import.model;

import java.util.Map;

/**
 * Земельный участок
 */
public class ZuElement extends KptElement {

    public static String XML_TAG = "land_record";

    public ZuElement(Map<String, Object> content) {
        super(content);
    }
}
