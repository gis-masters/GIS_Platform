package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.RULE_ID;
import static ru.mycrg.data_service_contract.enums.ValueType.*;

/**
 * Расчёт ruleId для территорий РФ и субъектов РФ
 */
@Component
public class TerrRfAndSubRfFormulaGenerator implements IWellKnownFormulaGenerator {

    private final Map<String, List<String>> allowedFieldTypes;

    public TerrRfAndSubRfFormulaGenerator() {
        this.allowedFieldTypes = new HashMap<>();
        allowedFieldTypes.put("classid", List.of(CHOICE.name(), STRING.name(), INT.name(), LONG.name()));
        allowedFieldTypes.put(RULE_ID, List.of(STRING.name()));
    }

    @Override
    public String generate() {
        return " GENERATED ALWAYS AS " +
                "( " +
                "CASE " +
                "WHEN classid::text != 'null' THEN (classid::text ||'0'||'1') " +
                "ELSE '0' " +
                "END " +
                ") STORED";
    }

    @Override
    public String getType() {
        return "rule_id_terr_Rf_subRf";
    }

    @Override
    public String validate(SchemaDto schema) {
        return validate(schema, allowedFieldTypes);
    }
}
