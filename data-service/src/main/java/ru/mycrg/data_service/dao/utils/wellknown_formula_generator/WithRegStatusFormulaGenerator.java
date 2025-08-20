package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.RULE_ID;
import static ru.mycrg.data_service_contract.enums.ValueType.*;

/**
 * Расчёт ruleId по схемам, у которых есть поле reg_status.
 */
@Component
public class WithRegStatusFormulaGenerator implements IWellKnownFormulaGenerator {

    private final Map<String, List<String>> allowedFieldTypes;

    public WithRegStatusFormulaGenerator() {
        this.allowedFieldTypes = new HashMap<>();
        allowedFieldTypes.put("classid", List.of(CHOICE.name(), STRING.name(), INT.name(), LONG.name()));
        allowedFieldTypes.put(RULE_ID, List.of(STRING.name()));
        allowedFieldTypes.put("status", List.of(CHOICE.name(), STRING.name(), INT.name(), LONG.name()));
        allowedFieldTypes.put("reg_status", List.of(CHOICE.name(), STRING.name(), INT.name(), LONG.name()));
    }

    @Override
    public String generate() {
        return " GENERATED ALWAYS AS " +
                "( CASE " +
                "when (reg_status != '1' and reg_status != '2' and reg_status != '3' and reg_status != '4' and " +
                "reg_status != '5' and reg_status != '6') " +
                "and (status != '1' and status != '2' and status != '3' and status != '4') " +
                "and classid::text != 'null' then (classid::text ||'0'||'0') " +
                "when (reg_status != '1' and reg_status != '2' and reg_status != '3' and reg_status != '4' and " +
                "reg_status != '5' and reg_status != '6') " +
                "and (status = '1' or status = '2' or status = '3' or status = '4') " +
                "and classid::text != 'null' then (classid::text ||'0'||status) " +
                "when (reg_status = '1' or reg_status = '2') " +
                "and status != '1' and status != '2' and status != '3' and status != '4' or status is null " +
                "and classid::text != 'null' then (classid::text ||reg_status||'0') " +
                "when (reg_status = '3' or reg_status = '4' or reg_status = '5' or reg_status = '6') " +
                "and status != '1' and status != '2' and status != '3' and status != '4' " +
                "and classid::text != 'null' then (classid::text ||'3'||'0') " +
                "when (reg_status = '3' or reg_status = '4' or reg_status = '5' or reg_status = '6') " +
                "and (status = '1' or status = '2' or status = '3' or status = '4') " +
                "and classid::text != 'null' then (classid::text ||'3'||status) " +
                "when (reg_status = '1' or reg_status = '2') " +
                "and (status = '1' or status = '2' or status = '3' or status = '4') " +
                "and classid::text != 'null' then (classid::text||reg_status||status) " +
                "when reg_status is null " +
                "and (status = '1' or status = '2' or status = '3' or status = '4') " +
                "and classid::text != 'null' then (classid::text||'0'||status) " +
                "else '0' " +
                "end " +
                ") STORED";
    }

    @Override
    public String getType() {
        return "rule_id_with_regstatus";
    }

    @Override
    public String validate(SchemaDto schema) {
        return validate(schema, allowedFieldTypes);
    }
}
