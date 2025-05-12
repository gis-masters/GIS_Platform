package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service_contract.enums.ValueType.DATETIME;
import static ru.mycrg.data_service_contract.enums.ValueType.TEXT;

/**
 * Расчёт статуса при публикации документа в ГИСОГД РФ.
 */
@Component
public class GisogdRfSyncStatusFormulaGenerator implements IWellKnownFormulaGenerator {

    private final Map<String, List<String>> allowedFieldTypes;

    public GisogdRfSyncStatusFormulaGenerator() {
        this.allowedFieldTypes = new HashMap<>();
        allowedFieldTypes.put("last_modified", List.of(DATETIME.name()));
        allowedFieldTypes.put("gisogdrf_publication_datetime", List.of(DATETIME.name()));
        allowedFieldTypes.put("gisogdrf_audit_datetime", List.of(DATETIME.name()));
        allowedFieldTypes.put("gisogdrf_response", List.of(TEXT.name()));
    }

    @Override
    public String generate() {
        return " GENERATED ALWAYS AS (" +
                " CASE " +
                "  WHEN (((gisogdrf_response)::json ->> 'Status'::text) = 'Error'::text)" +
                "    THEN 'Синхронизация завершилась ошибкой'::text" +
                "  WHEN (((gisogdrf_response)::json ->> 'Status'::text) = 'Warning'::text)" +
                "    THEN 'Синхронизация завершилась предупреждением'::text" +
                "  WHEN (((gisogdrf_response)::json ->> 'Status'::text) = 'Success'::text)" +
                "    THEN 'Синхронизирован'::text" +
                "  WHEN (((gisogdrf_response)::json ->> 'Status'::text) = 'NotFound'::text)" +
                "    THEN 'В процессе синхронизации'::text" +
                "  WHEN (((gisogdrf_response)::json ->> 'Status'::text) = 'Processing'::text)" +
                "    THEN 'В процессе синхронизации'::text" +
                "  WHEN (last_modified < gisogdrf_publication_datetime)" +
                "    THEN 'В процессе синхронизации'::text" +
                "  ELSE 'Не синхронизирован'::text" +
                " END) STORED";
    }

    @Override
    public String getType() {
        return "gisogdRfSyncStatus";
    }

    @Override
    public String validate(SchemaDto schema) {
        return validate(schema, allowedFieldTypes);
    }
}
