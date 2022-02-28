package ru.mycrg.data_service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DetailedLogger {

    private DetailedLogger() {
        throw new IllegalStateException("Utility class");
    }

    private static final Logger log = LoggerFactory.getLogger(DetailedLogger.class);

    public static void logError(String msg, Throwable cause) {
        if (cause.getMessage() != null) {
            logCause(msg, cause.getMessage(), cause);
        } else if (cause.getCause() != null) {
            logCause(msg, cause.getMessage(), cause.getCause());
        } else {
            logCause(msg, null, cause);
        }
    }

    private static void logCause(String msg, String reason, Throwable cause) {
        if (reason == null) {
            log.error(msg, cause);
        } else {
            log.error("{}. Reason: {}", msg, reason, cause);
        }
    }
}
