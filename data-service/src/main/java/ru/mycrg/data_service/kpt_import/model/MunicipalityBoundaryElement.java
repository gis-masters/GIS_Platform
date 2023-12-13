package ru.mycrg.data_service.kpt_import.model;

import java.util.Map;

public class MunicipalityBoundaryElement extends KptElement {

    public static String XML_TAG = "inhabited_locality_boundary_record";

    public MunicipalityBoundaryElement(Map<String, Object> content) {
        super(content);
    }
}
