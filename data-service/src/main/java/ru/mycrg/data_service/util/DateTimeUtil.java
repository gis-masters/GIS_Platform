package ru.mycrg.data_service.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static ru.mycrg.data_service.config.CrgCommonConfig.*;

public class DateTimeUtil {

    public static LocalDateTime now() {
        return LocalDateTime.now(DEFAULT_ZONE);
    }

    public static String nowAsString() {
        return LocalDateTime.now(DEFAULT_ZONE).format(DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN));
    }
}
