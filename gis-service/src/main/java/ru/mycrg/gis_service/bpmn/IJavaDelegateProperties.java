package ru.mycrg.gis_service.bpmn;

public interface IJavaDelegateProperties {

    String CREATE_ORGANIZATION_PROCESS_ID = "gis_createOrgOnGeoserver";
    String REMOVE_ORGANIZATION_PROCESS_ID = "gis_deleteOrgOnGeoserver";

    String CREATE_DTO_VAR_NAME = "createOrgDto";
    String ORG_ID_VAR_NAME = "orgId";
    String WORKSPACES_VAR_NAME = "workspaces";
    String USERS_VAR_NAME = "users";
    String TOKEN_VAR_NAME = "accessToken";

}
