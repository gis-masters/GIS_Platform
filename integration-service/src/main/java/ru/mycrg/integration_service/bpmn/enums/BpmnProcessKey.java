package ru.mycrg.integration_service.bpmn.enums;

public enum BpmnProcessKey {

    CREATE_ORGANIZATION_PROCESS_ID("integration_createOrganizationProcess"),
    REMOVE_ORGANIZATION_PROCESS_ID("integration_deleteOrganizationProcess"),
    RESOURCE_ANALYZE_PROCESS("integration_resourceAnalyzeProcess");

    private final String value;

    BpmnProcessKey(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
