package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service_contract.enums.ValueType.CHOICE;
import static ru.mycrg.data_service_contract.enums.ValueType.STRING;

/**
 * Рассчёт цвета обводки по label.
 */
@Component
public class LabelStrokeColorFunctionGenerator implements IWellKnownFormulaGenerator {

    private final Map<String, List<String>> allowedFieldTypes;

    public LabelStrokeColorFunctionGenerator() {
        this.allowedFieldTypes = new HashMap<>();
        allowedFieldTypes.put("label", List.of(CHOICE.name(), STRING.name()));
    }

    @Override
    public String generate() {
        return "GENERATED ALWAYS AS (substr(MD5(label), 1, 6)) STORED";
    }

    @Override
    public String getType() {
        return "label_stroke_color";
    }

    @Override
    public String validate(SchemaDto schema) {
        return validate(schema, allowedFieldTypes);
    }
}
