package ru.mycrg.data_service.kpt_import.model.oks;

import ru.mycrg.data_service.kpt_import.model.KptElement;

import java.util.Map;

public class OksBuildingElement extends KptElement {

    public static String XML_TAG = "build_record";

    public OksBuildingElement(Map<String, Object> content) {
        super(content);
    }
}
