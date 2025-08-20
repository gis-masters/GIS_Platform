package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service_contract.enums.ValueType.DATETIME;
import static ru.mycrg.data_service_contract.enums.ValueType.STRING;

/**
 * Рассчёт цвета обводки по date_stroke_color.
 */
@Component
public class DateStrokeColorFunctionGenerator implements IWellKnownFormulaGenerator {

    private final Map<String, List<String>> allowedFieldTypes;

    public DateStrokeColorFunctionGenerator() {
        this.allowedFieldTypes = new HashMap<>();
        allowedFieldTypes.put("photography_time", List.of(DATETIME.name(), STRING.name()));
    }

    @Override
    public String generate() {
        return "GENERATED ALWAYS AS (substr(MD5(date_part('epoch', COALESCE(photography_time, '1990-01-01'))::text), 1, 6)) STORED";
    }

    @Override
    public String getType() {
        return "date_stroke_color";
    }

    @Override
    public String validate(SchemaDto schema) {
        return validate(schema, allowedFieldTypes);
    }
}
