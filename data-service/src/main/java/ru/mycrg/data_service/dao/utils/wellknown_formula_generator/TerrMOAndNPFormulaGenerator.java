package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.RULE_ID;
import static ru.mycrg.data_service_contract.enums.ValueType.*;

/**
 * Расчёт ruleId по схемам для муниципальных образований и населённых пунктов.
 */
@Component
public class TerrMOAndNPFormulaGenerator implements IWellKnownFormulaGenerator {

    private final Map<String, List<String>> allowedFieldTypes;

    public TerrMOAndNPFormulaGenerator() {
        this.allowedFieldTypes = new HashMap<>();
        allowedFieldTypes.put("classid", List.of(CHOICE.name(), STRING.name(), INT.name(), LONG.name()));
        allowedFieldTypes.put(RULE_ID, List.of(STRING.name()));
        allowedFieldTypes.put("status_adm", List.of(CHOICE.name(), STRING.name(), INT.name(), LONG.name()));
    }

    @Override
    public String generate() {
        return " GENERATED ALWAYS AS " +
                "( CASE " +
                "when status_adm = '1' and classid::text != 'null' then (classid::text ||'0'||status_adm) " +
                "when status_adm = '2' and classid::text != 'null' then (classid::text ||'0'||status_adm) " +
                "when status_adm != '2' and status_adm != '1' and classid::text != 'null' then (classid::text " +
                "||'0'||'0') else '0' end ) STORED";
    }

    @Override
    public String getType() {
        return "rule_id_terr_mo_np";
    }

    @Override
    public String validate(SchemaDto schema) {
        return validate(schema, allowedFieldTypes);
    }
}
