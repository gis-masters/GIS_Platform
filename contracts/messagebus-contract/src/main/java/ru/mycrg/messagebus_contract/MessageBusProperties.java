package ru.mycrg.messagebus_contract;

public class MessageBusProperties {

    // Валидация
    public static final String FANOUT_VALIDATION_START = "fanout.validation.start";
    public static final String QUEUE_VALIDATION_START = "validation.start";
    public static final String KEY_VALIDATION_START = "key.validation.start";

    public static final String FANOUT_VALIDATION_RESULT = "fanout.validation.result";
    public static final String QUEUE_VALIDATION_RESULT = "validation.result";
    public static final String KEY_VALIDATION_RESULT = "key.validation.result";

    // Импорт
    public static final String FANOUT_IMPORT_INIT = "fanout.import.init";
    public static final String QUEUE_IMPORT_INIT = "import.init";
    public static final String KEY_IMPORT_INIT = "init.import.key";

    public static final String FANOUT_IMPORT_RESPONSE = "fanout.import.response";
    public static final String QUEUE_IMPORT_RESPONSE = "import.response";
    public static final String KEY_IMPORT_RESPONSE = "init.response.key";

    // Экспорт
    public static final String FANOUT_EXPORT_INIT = "fanout.export.init";
    public static final String QUEUE_EXPORT_INIT = "export.init";
    public static final String KEY_EXPORT_INIT = "key.export.init";

    public static final String FANOUT_EXPORT_RESPONSE = "fanout.export.response";
    public static final String QUEUE_EXPORT_RESPONSE = "export.response";
    public static final String KEY_EXPORT_RESPONSE = "key.export.response";

    // Organization
    public static final String ORG_REQUEST_QUEUE = "org.request.queue";
    public static final String ORG_REQUEST_FANOUT = "org.request.fanout";
    public static final String ORG_REQUEST_KEY = "org.request.key";

    public static final String ORG_RESPONSE_QUEUE = "org.response.queue";
    public static final String ORG_RESPONSE_FANOUT = "org.response.fanout";
    public static final String ORG_RESPONSE_KEY = "org.response.key";

    // User
    public static final String USER_REQUEST_QUEUE = "user.request.queue";
    public static final String USER_REQUEST_FANOUT = "user.request.fanout";
    public static final String USER_REQUEST_KEY = "user.request.key";

    public static final String USER_RESPONSE_QUEUE = "user.response.queue";
    public static final String USER_RESPONSE_FANOUT = "user.response.fanout";
    public static final String USER_RESPONSE_KEY = "user.response.key";

    // Audit
    public static final String AUDIT_REQUEST_QUEUE = "audit.request.queue";
    public static final String AUDIT_REQUEST_FANOUT = "audit.request.fanout";
    public static final String AUDIT_REQUEST_KEY = "audit.request.key";

    // deleteRemoteReferences
    public static final String COMMON_REQUEST_QUEUE = "commonRequestQueue";
    public static final String COMMON_RESPONSE_QUEUE = "commonResponseQueue";

    // File
    public static final String FILE_REQUEST_QUEUE = "fileRequestQueue";

    // Common
    public static final String DATA_TO_AUTH_EXCHANGE = "dataToAuthExchange";
    public static final String AUTH_TO_DATA_EXCHANGE = "authToDataExchange";
    public static final String DATA_TO_INTEGRATION_QUEUE = "dataToIntegrationQueue";
    public static final String INTEGRATION_TO_DATA_QUEUE = "IntegrationToDataQueue";
    public static final String DATA_TO_GEO_WRAPPER_QUEUE = "dataToGeoWrapperQueue";
    public static final String GEO_WRAPPER_TO_DATA_QUEUE = "GeoWrapperToDataQueue";

    // Rpc data-service - gis-service
    public static final String RPC_REQUEST_QUEUE = "rpc_request_queue";
    public static final String RPC_REPLY_QUEUE = "rpc_reply_queue";
    public static final String RPC_TOPIC_EXCHANGE = "rpc_topic_exchange";

    // Auth publish/subscribe
    public static final String AUTH_TO_DATA_QUEUE = "authToDataQueue";
    public static final String AUTH_TO_GIS_QUEUE = "authToGisQueue";
    public static final String AUTH_TO_INTEGRATION_QUEUE = "authToIntegrationQueue";

    // Org settings
    public static final String ORG_SETTINGS_FANOUT = "orgSettingsFanout";
    public static final String ORG_SETTINGS_KEY = "orgSettingsFanoutKey";

    // System tags updated
    public static final String SYSTEM_TAGS_UPDATED_QUEUE = "systemTagsUpdatedQueue";
    public static final String SYSTEM_TAGS_REQUEST_QUEUE = "systemTagsRequestQueue";
    public static final String SYSTEM_TAGS_UPDATED_ROUTING_KEY = "systemTagsUpdated";
    public static final String SYSTEM_TAGS_REQUEST_ROUTING_KEY = "systemTagsRequest";

    // GisogdRf
    public static final String GISOGD_PUBLICATION_QUEUE = "gisogdPublicationQueue";
    public static final String GISOGD_PUBLICATION_RESPONSE_QUEUE = "gisogdPublicationResponseQueue";

    public static final String GISOGD_AUDIT_QUEUE = "gisogdAuditQueue";
    public static final String GISOGD_AUDIT_RESPONSE_QUEUE = "gisogdAuditResponseQueue";

    // SMEV 3 adapter
    public static final String SMEV3_RECEIVE_QUEUE = "_QUEUE_RECEIVE";
    public static final String SMEV3_RECEIVE_FAIL_QUEUE = "_QUEUE_RECEIVE_FAIL";
    public static final String SMEV3_SEND_QUEUE = "_QUEUE_SEND";

    // Импорт КПТ
    public static final String IMPORT_KPT_TASK_QUEUE = "importKptTaskQueue";
}
