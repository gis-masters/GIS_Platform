package ru.mycrg.data_service.config;

public class CrgCommonConfig {

    private CrgCommonConfig() {
        throw new IllegalStateException("Utility config class");
    }

    public static final String ROOT_FOLDER_PATH = "/root";

    public static final String SYSTEM_DATE_PATTERN = "yyyy-MM-dd";

    public static final String SYSTEM_DATETIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
}
