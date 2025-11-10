package ru.mycrg.integration_service.bpmn;

public interface IJavaDelegateProperties {

    String EVENT_VAR_NAME = "event";
    String EVENT_SUB_PAYLOAD_NAME = "event_sub_payload";
    String EVENT_IMPORT_GPKG_REPORT_NAME = "event_import_gpkg_report";
    String EVENT_IMPORT_GPKG_BACKWARD_DATA_NAME = "event_import_gpkg_backward_data";
    String FAIL_REASON = "failReason";

    String TOKEN_VAR_NAME = "token";
    String DB_NAME = "dbName";
    String ORG_ID_VAR_NAME = "orgId";
    String PROCESS_ID_VAR_NAME = "processId";
    String CREATED_LAYER_GROUP_ID = "createdLayerGroupId";

    String USERS_VAR_NAME = "users";
    String USER_GEOSERVER_NAME = "geoserverLogin";

    String IS_DELETED_VAR_NAME = "isDeleted";
    String IS_CREATED_VAR_NAME = "isCreated";

    String ITERATION_COUNTER_VAR_NAME = "counter";
    String NEEDED_CYCLES_COUNT_VAR_NAME = "neededCyclesCount";
    String PERFORMED_CYCLES_COUNT_VAR_NAME = "performedCyclesCount";
    String SPECIALIZATION_LAYERS_FOR_PUBLICATION = "SPECIALIZATION_LAYERS_FOR_PUBLICATION";

    String CHECK_STATUS_VAR_NAME = "checkStatus";

    String BUSINESS_KEY_VAR_NAME = "businessKey";
    String GPKG_PATH_VAR_NAME = "gpkgPath";

    String ENTITY_ID_VAR_NAME = "entityId";

    String LAYER_COMPLEX_NAME = "layerComplexName";
    String EXTRACTED_SCHEMA_NAME = "extractedSchemaName";
}
