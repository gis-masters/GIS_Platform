package ru.mycrg.data_service.mappers;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;

/**
 * Маппер для сущности схема.
 */
public class SchemaEntityMapper {

    private SchemaEntityMapper() {
        throw new IllegalStateException("Utility class");
    }

    @Nullable
    public static SchemaDto mapToDto(SchemaTemplate schemaTemplate) {
        SchemaDto schemaDto = SchemaMapper.jsonToDto(schemaTemplate.getClassRule());
        if (schemaDto == null) {
            return null;
        }

        schemaDto.setCustomRuleFunction(schemaTemplate.getCustomRule());
        schemaDto.setCalcFiledFunction(schemaTemplate.getCalculatedFields());

        return schemaDto;
    }

    @NotNull
    public static SchemaTemplate mapToEntity(SchemaTemplate template, SchemaDto schemaDto) {
        template.setName(schemaDto.getName());
        template.setClassRule(toJsonNode(schemaDto));

        String customRuleFunction = schemaDto.getCustomRuleFunction();
        if (customRuleFunction != null) {
            template.setCustomRule(customRuleFunction);
        }

        String calcFiledFunction = schemaDto.getCalcFiledFunction();
        if (calcFiledFunction != null) {
            template.setCalculatedFields(calcFiledFunction);
        }

        return template;
    }
}
