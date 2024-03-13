package ru.mycrg.data_service.mappers;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;

/**
 * Маппер для сущности схема.
 */
public class SchemaEntityMapper {

    private SchemaEntityMapper() {
        throw new IllegalStateException("Utility class");
    }

    public static SchemaDto mapToDto(Schema schema) {
        SchemaDto schemaDto = SchemaMapper.jsonToDto(schema.getClassRule());
        if (schemaDto == null) {
            throw new DataServiceException("Не удалось прочитать схему");
        }

        schemaDto.setCustomRuleFunction(schema.getCustomRule());
        schemaDto.setCalcFiledFunction(schema.getCalculatedFields());

        return schemaDto;
    }

    @NotNull
    public static Schema mapToEntity(Schema entity, SchemaDto schemaDto) {
        entity.setName(schemaDto.getName());
        entity.setClassRule(toJsonNode(schemaDto));

        String customRuleFunction = schemaDto.getCustomRuleFunction();
        if (customRuleFunction != null) {
            entity.setCustomRule(customRuleFunction);
        }

        String calcFiledFunction = schemaDto.getCalcFiledFunction();
        if (calcFiledFunction != null) {
            entity.setCalculatedFields(calcFiledFunction);
        }

        return entity;
    }
}
