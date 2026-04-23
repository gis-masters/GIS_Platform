package ru.mycrg.data_service.mappers;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.common_contracts.generated.data_service.SchemaTemplateProjection;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import static ru.mycrg.http_client.JsonConverter.toJsonNode;

/**
 * Маппер для сущности схема.
 */
public class SchemaEntityMapper {

    private SchemaEntityMapper() {
        throw new IllegalStateException("Utility class");
    }

    @Nullable
    public static SchemaDto mapToSchemaDto(SchemaTemplate schemaTemplate) {
        SchemaDto schemaDto = SchemaMapper.jsonToDto(schemaTemplate.getClassRule());
        if (schemaDto == null) {
            return null;
        }

        schemaDto.setCustomRuleFunction(schemaTemplate.getCustomRule());
        schemaDto.setCalcFiledFunction(schemaTemplate.getCalculatedFields());

        return schemaDto;
    }

    @Nullable
    public static SchemaDto mapToSchemaDto(SchemaTemplateProjection projection) {
        SchemaDto schemaDto = SchemaMapper.jsonToDto(projection.getClassRule());
        if (schemaDto == null) {
            return null;
        }

        schemaDto.setCustomRuleFunction(projection.getCustomRule());
        schemaDto.setCalcFiledFunction(projection.getCalculatedFields());

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

    @NotNull
    public static SchemaTemplateProjection mapToProjection(SchemaTemplate template) {
        SchemaTemplateProjection projection = new SchemaTemplateProjection();

        projection.setId(template.getId());
        projection.setName(template.getName());
        projection.setClassRule(template.getClassRule());
        projection.setCustomRule(template.getCustomRule());
        projection.setCalculatedFields(template.getCalculatedFields());
        projection.setSystem(template.getIsSystem());
        projection.setCreatedBy(template.getCreatedBy());
        projection.setCreatedAt(template.getCreatedAt() != null
                                        ? template.getCreatedAt().toString()
                                        : null);
        projection.setLastModified(template.getLastModified() != null
                                           ? template.getLastModified().toString()
                                           : null);
        projection.setModifiedBy(template.getModifiedBy());

        return projection;
    }
}
