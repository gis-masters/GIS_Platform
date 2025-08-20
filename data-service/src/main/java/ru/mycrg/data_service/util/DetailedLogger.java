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
            logCause(msg, cause, false);
        } else if (cause.getCause() != null) {
            logCause(msg, cause.getCause(), false);
        } else {
            logCause(msg, cause, false);
        }
    }

    public static void logErrorQuietly(String msg, Throwable cause) {
        if (cause.getMessage() != null) {
            logCause(msg, cause, true);
        } else if (cause.getCause() != null) {
            logCause(msg, cause.getCause(), true);
        } else {
            logCause(msg, cause, true);
        }
    }

    private static void logCause(String msg, Throwable cause, boolean quietly) {
        if (quietly) {
            log.trace(msg, cause);
        } else {
            log.error(msg, cause);
        }
    }
}
