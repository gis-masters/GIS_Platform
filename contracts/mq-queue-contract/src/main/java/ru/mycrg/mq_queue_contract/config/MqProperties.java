package ru.mycrg.mq_queue_contract.config;

public class MqProperties {

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
    public static final String FANOUT_GML_INIT = "fanout.gml.init";
    public static final String QUEUE_GML_INIT = "gml.init";
    public static final String KEY_GML_INIT = "key.gml.init";

    public static final String FANOUT_GML_RESPONSE = "fanout.gml.response";
    public static final String QUEUE_GML_RESPONSE = "gml.response";
    public static final String KEY_GML_RESPONSE = "key.gml.response";

    public static final String FANOUT_POSTGRE_VALIDATION = "fanout.postgre.validation";
    public static final String QUEUE_POSTGRE_VALIDATION = "postgre.validation";
    public static final String KEY_POSTGRE_VALIDATION = "key.postgre.validation";

}
