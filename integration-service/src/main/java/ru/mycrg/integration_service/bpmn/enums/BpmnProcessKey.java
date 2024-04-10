package ru.mycrg.integration_service.bpmn.enums;

public enum BpmnProcessKey {

    CREATE_ORGANIZATION_PROCESS_ID("integration_createOrganizationProcess"),
    REMOVE_ORGANIZATION_PROCESS_ID("integration_deleteOrganizationProcess"),
    RESOURCE_ANALYZE_PROCESS("integration_resourceAnalyzeProcess"),
    USER_DELETE_PROCESS("integration_userDeleteProcess"),
    CLEAR_GROUP_PERMISSIONS("integration_clearGroupPermissionProcess"),
    REFERENCE_LAYER_DELETION_PROCESS("integration_layerDeleteProcess"),
    FILE_PLACEMENT_PROCESS("integration_filePlacementProcess");

    private final String value;

    BpmnProcessKey(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
