package ru.mycrg.acceptance;

import java.time.format.DateTimeFormatter;

public class Config {

    public static final String PATCH_CONTENT_TYPE = "application/merge-patch+json";

    public static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
}
