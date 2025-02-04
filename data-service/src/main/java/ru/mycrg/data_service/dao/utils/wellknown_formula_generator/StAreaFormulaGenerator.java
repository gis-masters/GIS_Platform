package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service_contract.enums.ValueType.GEOMETRY;

@Component
public class StAreaFormulaGenerator implements IWellKnownFormulaGenerator {

    private final Map<String, List<String>> allowedFieldTypes;

    public StAreaFormulaGenerator() {
        this.allowedFieldTypes = new HashMap<>();

        allowedFieldTypes.put(DEFAULT_GEOMETRY_COLUMN_NAME, List.of(GEOMETRY.name()));
    }

    @Override
    public String generate() {
        return " GENERATED ALWAYS AS (public.st_area(shape)) STORED";
    }

    @Override
    public String getType() {
        return "st_area";
    }

    @Override
    public String validate(SchemaDto schema) {
        return validate(schema, allowedFieldTypes);
    }
}
