package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;
import org.postgresql.util.PSQLException;
import org.postgresql.util.ServerErrorMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ErrorDetailsExtractor {

    private ErrorDetailsExtractor() {
        throw new IllegalStateException("Utility class");
    }

    private static final Logger log = LoggerFactory.getLogger(ErrorDetailsExtractor.class);

    @NotNull
    public static Map<String, String> extractDetails(Exception exception) {
        Map<String, String> errors = new HashMap<>();

        Throwable cause = exception.getCause();
        if (cause instanceof PSQLException) {
            ServerErrorMessage serverErrorMessage = ((PSQLException) cause).getServerErrorMessage();
            String message = serverErrorMessage.getMessage();
            String column = serverErrorMessage.getColumn();
            if (column == null) {
                column = extractColumn(message);
            }

            errors.put(column, message);
        } else {
            log.debug("Cant extract details: its not PSQLException");
        }

        return errors;
    }

    @NotNull
    private static String extractColumn(String errorMsg) {
        String result = null;

        Pattern p = Pattern.compile("\"([^\"]*)\"");
        Matcher m = p.matcher(errorMsg);
        while (m.find()) {
            result = m.group(1);
        }

        if (result != null) {
            return result;
        } else {
            log.debug("Cant extract details from: {}", errorMsg);

            return "";
        }
    }
}
