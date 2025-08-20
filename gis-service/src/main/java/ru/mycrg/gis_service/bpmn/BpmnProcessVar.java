package ru.mycrg.gis_service.bpmn;

public enum BpmnProcessVar {

    PROCESS_ID_VAR_NAME("PROCESS_ID_VAR_NAME"),
    CREATE_DTO_VAR_NAME("createOrgDto"),
    ORG_ID_VAR_NAME("orgId"),
    WORKSPACES_VAR_NAME("workspaces"),
    USERS_VAR_NAME("users"),
    TOKEN_VAR_NAME("accessToken"),
    ITERATION_COUNTER_VAR_NAME("counter"),
    CHECK_STATUS_VAR_NAME("checkStatus");

    private final String value;

    BpmnProcessVar(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
