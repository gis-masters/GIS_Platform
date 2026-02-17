package ru.mycrg.integration_service.bpmn;

public interface IJavaDelegateProperties {

    String EVENT_VAR_NAME = "event";
    String EVENT_SUB_PAYLOAD_NAME = "event_sub_payload";

    String EVENT_IMPORT_GPKG_BACKWARD_EXTRACTED_RASTERS_NAME = "event_import_gpkg_backward_extracted_rasters";
    String FAIL_REASON = "failReason";
    String PREV_STEP_STATUS = "prevStepStatus";

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

    /**                                               **\
     * ============================================== *
     * Переменные относящиеся к процессу импорта GPKG *
     * ============================================== *
     */
    String IMPORT_GPKG_WORKER_TYPE = "importGpkgWorkerType";

    String IMPORT_GPKG_EVENT = "importGpkgEvent";
    String IMPORT_GPKG_EVENT_REPORT = "importGpkgEventReport";
    String IMPORT_GPKG_COUNT_HTTP_ERRORS = "importGpkgCounter";
    String IMPORT_GPKG_CREATED_LAYER_GROUP_ID = "importGpkgCreatedLayerGroupId";

    String IMPORT_GPKG_EXTRACTED_SCHEMA_NAME = "importGpkgExtractedSchemaName";
    String IMPORT_GPKG_FAIL_REASON = "importGpkgFailReason";
    String IMPORT_GPKG_NEEDED_CYCLES_COUNT_VECTOR = "importGpkgNeededCyclesCountVector";
    String IMPORT_GPKG_PERFORMED_CYCLES_COUNT_VECTOR = "importGpkgPerformedCyclesCountVector";
    String IMPORT_GPKG_ALL_VECTOR_TABLES = "importGpkgAllVectorTables";
    String IMPORT_GPKG_CURRENT_VECTOR_TABLE = "importGpkgCurrentVectorTable";
    String IMPORT_GPKG_BACKWARD_EXTRACTED_DATA = "importGpkgBackwardExtractedData";
    String IMPORT_GPKG_CREATED_TABLE_NAME = "importGpkgCreatedTableName";

    String IMPORT_GPKG_CYCLES_COUNT_FILES = "importGpkgFilesCyclesCountFiles";
    String IMPORT_GPKG_CYCLES_COUNT_FILES_DONE = "importGpkgFilesCyclesCountFilesDone";
    String IMPORT_GPKG_FEATURES_WITH_FILES_LIST = "importGpkgFeaturesWithFilesList";
    String IMPORT_GPKG_CURRENT_FEATURE_WITH_FILES = "importGpkgCurrentFeatureWithFiles";
    String IMPORT_GPKG_FILES_LIST = "importGpkgFilesList";
    String IMPORT_GPKG_BACKWARD_FILE_CREATE = "importGpkgBackwardFileCreate";

    String IMPORT_GPKG_NEEDED_CYCLES_COUNT_RASTER = "importGpkgNeededCyclesCountRaster";
    String IMPORT_GPKG_PERFORMED_CYCLES_COUNT_RASTER = "importGpkgPerformedCyclesCountRaster";
    String IMPORT_GPKG_RASTERS_LIST = "importGpkgRastersList";
    String IMPORT_GPKG_CURRENT_RASTERS = "importGpkgCurrentRasters";
    String IMPORT_GPKG_GDAL_RASTERS_LIST = "importGpkgGdalRastersList";
    String IMPORT_GPKG_NEEDED_RASTER_PUBLISH_CYCLES_COUNT = "importGpkgNeededRasterPublishCyclesCount";
    String IMPORT_GPKG_PERFORMED_RASTER_PUBLISH_CYCLES_COUNT = "importGpkgPerformedRasterPublishCyclesCount";
    String IMPORT_GPKG_CURRENT_TILE = "importGpkgCurrentTile";
    String IMPORT_GPKG_CURRENT_PUBLISH_RASTER = "importGpkgCurrentPublishRaster";

    String IMPORT_GPKG_PUBLISH_RASTER_STATUS = "importGpkgPublishRasterStatus";
}
