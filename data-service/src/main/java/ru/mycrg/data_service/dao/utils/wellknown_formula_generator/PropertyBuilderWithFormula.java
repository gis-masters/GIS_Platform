package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.generatePropertySqlString;

@Component
public class PropertyBuilderWithFormula {

    private final WellKnownFormulaGenerator wkfGenerator;

    public PropertyBuilderWithFormula(WellKnownFormulaGenerator wkfGenerator) {
        this.wkfGenerator = wkfGenerator;
    }

    @NotNull
    public String buildProps(List<SimplePropertyDto> properties, String primaryKeyName) {
        StringBuilder props = new StringBuilder();
        for (SimplePropertyDto property: properties) {
            if (!property.getName().equalsIgnoreCase(primaryKeyName)) {
                String base = generatePropertySqlString(property);
                props.append(",").append(base);

                String calculatedValueWellKnownFormula = property.getCalculatedValueWellKnownFormula();
                if (calculatedValueWellKnownFormula != null) {
                    props.append(" ").append(wkfGenerator.generate(calculatedValueWellKnownFormula));
                }
            }
        }

        return props.toString();
    }
}
