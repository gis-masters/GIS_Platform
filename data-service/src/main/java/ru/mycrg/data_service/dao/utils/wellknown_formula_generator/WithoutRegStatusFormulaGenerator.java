package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.RULE_ID;
import static ru.mycrg.data_service_contract.enums.ValueType.*;

/**
 * Рассчёт ruleId по схемам, у которых нет поля reg_status.
 */
@Component
public class WithoutRegStatusFormulaGenerator implements IWellKnownFormulaGenerator {

    private final Map<String, List<String>> allowedFieldTypes;

    public WithoutRegStatusFormulaGenerator() {
        this.allowedFieldTypes = new HashMap<>();
        allowedFieldTypes.put("classid", List.of(CHOICE.name(), STRING.name(), INT.name(), LONG.name()));
        allowedFieldTypes.put(RULE_ID, List.of(STRING.name()));
        allowedFieldTypes.put("status", List.of(CHOICE.name(), STRING.name(), INT.name(), LONG.name()));
    }

    @Override
    public String generate() {
        return " GENERATED ALWAYS AS " +
                "( CASE " +
                "when status = '1' and classid::text != 'null' then (classid::text ||'0'||status) " +
                "when status = '2' and classid::text != 'null' then (classid::text ||'0'||status) " +
                "when status = '3' and classid::text != 'null' then (classid::text ||'0'||status) " +
                "when status = '4' and classid::text != 'null' then (classid::text ||'0'||status) " +
                "when status != '4' and status != '3' and status != '2' and status != '1' and classid::text != 'null' then " +
                "(classid::text ||'0'||'0') " +
                "ELSE '0' " +
                "END " +
                ") STORED";
    }

    @Override
    public String getType() {
        return "rule_id_without_regstatus";
    }

    @Override
    public String validate(SchemaDto schema) {
        return validate(schema, allowedFieldTypes);
    }
}
