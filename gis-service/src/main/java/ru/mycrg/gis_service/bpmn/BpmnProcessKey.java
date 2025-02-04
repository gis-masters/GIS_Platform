package ru.mycrg.gis_service.bpmn;

public enum BpmnProcessKey {

    CREATE_ORGANIZATION("gis_createOrgOnGeoserver"),
    REMOVE_ORGANIZATION("gis_deleteOrgOnGeoserver");

    private final String value;

    BpmnProcessKey(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
