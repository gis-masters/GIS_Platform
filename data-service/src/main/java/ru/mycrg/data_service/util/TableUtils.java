package ru.mycrg.data_service.util;

import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class TableUtils {

    public static List<String> conformityCheckColumnsFromDBAndSchema(Map<String, Object> data,
                                                                     List<String> columnNames) {
        List<String> notMatchingColumns = new ArrayList<>();

        Set<String> recordNames = data.keySet();

        for (String recordName: recordNames) {
            if (!columnNames.contains(recordName.toLowerCase())) {
                notMatchingColumns.add(recordName);
            }
        }

        return notMatchingColumns;
    }

    public static void throwIfNotMatchTableColumns(Map<String, Object> data, List<String> columnNames)
            throws DataServiceException {
        List<String> notMatchingColumns = conformityCheckColumnsFromDBAndSchema(data, columnNames);

        if (!notMatchingColumns.isEmpty()) {
            String commonMessage = "Данные не сохранены. Некорректный запрос";
            List<ErrorInfo> errors = new ArrayList<>();
            for (String column: notMatchingColumns) {
                ErrorInfo errorInfo = new ErrorInfo();
                errorInfo.setField(column);
                errorInfo.setMessage(String.format("Данные не сохранены. В базе данных поле %s отсутсвует.", column));

                errors.add(errorInfo);
            }

            throw new BadRequestException(commonMessage, errors);
        }
    }
}
