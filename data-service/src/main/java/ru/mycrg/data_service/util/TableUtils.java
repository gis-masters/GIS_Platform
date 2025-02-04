package ru.mycrg.data_service.util;

import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;

import java.util.*;

public class TableUtils {

    private TableUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static Long getParentId(String path) {
        String[] parentIdSplitted = path.split("/root/");

        return Long.valueOf(parentIdSplitted[1]);
    }

    public static Long getLatestParentId(String path) {
        int latestSplitter = path.lastIndexOf('/');
        String folderId = path.substring(latestSplitter + 1);

        return Long.valueOf(folderId);
    }

    public static void throwIfNotMatchTableColumns(Set<String> propsBySchema, List<String> dbColumns) {
        List<String> notMatchingColumns = getNotMatchingColumns(propsBySchema, dbColumns);

        if (!notMatchingColumns.isEmpty()) {
            List<ErrorInfo> errors = new ArrayList<>();
            for (String column: notMatchingColumns) {
                ErrorInfo errorInfo = new ErrorInfo();
                errorInfo.setField(column);
                errorInfo.setMessage(String.format("В базе данных поле %s отсутствует.", column));

                errors.add(errorInfo);
            }

            throw new BadRequestException("Некорректный запрос. Поля не соответствуют БД", errors);
        }
    }

    private static List<String> getNotMatchingColumns(Set<String> schemaProps,
                                                      List<String> dbColumns) {
        List<String> notMatchingColumns = new ArrayList<>();
        for (String key: schemaProps) {
            if (!dbColumns.contains(key.toLowerCase())) {
                notMatchingColumns.add(key);
            }
        }

        return notMatchingColumns;
    }
}
