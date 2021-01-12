package ru.mycrg.gis_service.bpmn;

public enum BPMNProcessVar {

    CREATE_DTO_VAR_NAME("createOrgDto"),
    ORG_ID_VAR_NAME("orgId"),
    WORKSPACES_VAR_NAME("workspaces"),
    USERS_VAR_NAME("users"),
    TOKEN_VAR_NAME("accessToken");

    private final String value;

    BPMNProcessVar(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
