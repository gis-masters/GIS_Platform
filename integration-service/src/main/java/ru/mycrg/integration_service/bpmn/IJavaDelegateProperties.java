package ru.mycrg.integration_service.bpmn;

public interface IJavaDelegateProperties {

    String EVENT_VAR_NAME = "event";
    String EVENT_SUB_PAYLOAD_NAME = "event_sub_payload";
    String FAIL_REASON = "failReason";

    String TOKEN_VAR_NAME = "token";
    String DB_NAME = "dbName";
    String ORG_ID_VAR_NAME = "orgId";
    String PROCESS_ID_VAR_NAME = "processId";

    String USERS_VAR_NAME = "users";
    String USER_GEOSERVER_NAME = "geoserverLogin";

    String IS_DELETED_VAR_NAME = "isDeleted";
    String IS_CREATED_VAR_NAME = "isCreated";

    String ITERATION_COUNTER_VAR_NAME = "counter";
    String SPECIALIZATION_LAYERS_FOR_PUBLICATION = "SPECIALIZATION_LAYERS_FOR_PUBLICATION";

    String CHECK_STATUS_VAR_NAME = "checkStatus";

    String BUSINESS_KEY_VAR_NAME = "businessKey";
    String GPKG_PATH_VAR_NAME = "gpkgPath";

    String ENTITY_ID_VAR_NAME = "entityId";

    String LAYER_COMPLEX_NAME = "layerComplexName";
}
