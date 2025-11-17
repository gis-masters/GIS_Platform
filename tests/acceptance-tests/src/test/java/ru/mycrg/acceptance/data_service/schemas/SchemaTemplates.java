package ru.mycrg.acceptance.data_service.schemas;

import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

import static ru.mycrg.acceptance.BaseStepsDefinitions.PRIMARY_KEY;
import static ru.mycrg.acceptance.loaders.SchemaLoader.loadSchemaFromResource;
import static ru.mycrg.acceptance.utils.GeometryUtils.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_POLYGON;

public class SchemaTemplates {

    public static SchemaDto getSchemaTemplateByTitle(String schemaTitle) {
        switch (schemaTitle) {
            case "tasks_schema_v1":
                return prepareTaskSchema();
            case "Точечный слой с атрибутами":
                return testPointAttributes();
            case "Схема для проверки типов STRING":
                return stringTypesSchema();
            case "Точечный слой с атрибутами - ошибочная, для теста":
                return testPointAttributesIncorrect();
            case "Все типы данных":
                return testAllAttributes();
            case "Точечный слой с атрибутами - исправленная":
                SchemaDto correctTestPointSchema = testPointAttributes();
                correctTestPointSchema.setTitle("Точечный слой с атрибутами - исправленная");

                List<SimplePropertyDto> ctpsProperties = correctTestPointSchema.getProperties();
                SimplePropertyDto ruleId = new SimplePropertyDto();
                ruleId.setName("ruleid");
                ruleId.setTitle("Идентификатор стиля");
                ruleId.setValueType("STRING");

                SimplePropertyDto objectId = new SimplePropertyDto();
                objectId.setName(PRIMARY_KEY);
                objectId.setTitle("Идентификатор объекта");
                objectId.setValueType("LONG");

                ctpsProperties.add(ruleId);
                ctpsProperties.add(objectId);

                return correctTestPointSchema;
            case "Тест FTS - исключение hidden полей":
                return testFtsHiddenFieldsSchema();
            case "Тестовая схема dl_default":
                SchemaDto schema0 = dlDefaultSchema();
                schema0.setTitle("Тестовая схема dl_default");

                return schema0;
            case "rule_id_terr_Rf_subRf без требуемых полей":
                SchemaDto schema1 = prepareFunctionalZoneWithTerrRfFormulaWithoutRequiredField();
                schema1.setTitle("rule_id_terr_Rf_subRf без требуемых полей");

                return schema1;
            case "rule_id_terr_Rf_subRf с неподходящими типами полей":
                SchemaDto schema2 = prepareFunctionalZoneWithTerrRf_SubRfFormulaWithNotAllowedFieldType();
                schema2.setTitle("rule_id_terr_Rf_subRf с неподходящими типами полей");

                return schema2;
            case "rule_id_terr_Rf_subRf":
                SchemaDto schema3 = prepareFunctionalZoneWithTerrRf_SubRfFormulaWithRequiredField();
                schema3.setTitle("rule_id_terr_Rf_subRf");

                return schema3;
            case "с калькулируемыми формулами":
                SchemaDto schema = prepareSchemaWithCalculatedValueFormulaAndValidationFormula();
                schema.setTitle("с калькулируемыми формулами");

                return schema;
            case "тест копирования - схема поставщика":
                SchemaDto sourceSchema = prepareSchemaSource();
                sourceSchema.setTitle("тест копирования - схема поставщика");

                return sourceSchema;
            case "тест копирования - схема потребителя":
                SchemaDto targetSchema = prepareSchemaTarget();
                targetSchema.setTitle("тест копирования - схема потребителя");

                return targetSchema;
            case "с тэгом 'Приказ 10'":
                SchemaDto schemaWithOrder10 = prepareSchemaWithTags();
                schemaWithOrder10.setName("schemaWithTagsOrder10");
                schemaWithOrder10.setTitle("с тэгом 'Приказ 10'");
                schemaWithOrder10.setTags(List.of("Приказ 10", "system"));

                return schemaWithOrder10;
            case "с тэгом 'Приказ 123'":
                SchemaDto schemaWithOrder123 = prepareSchemaTarget();
                schemaWithOrder123.setName("schemaWithTagsOrder123");
                schemaWithOrder123.setTitle("с тэгом 'Приказ 123'");
                schemaWithOrder123.setTags(List.of("Приказ 123", "system"));

                return schemaWithOrder123;
            case "с тэгами 'Приказ 10' и 'Приказ 123'":
                SchemaDto schemaBoth = prepareSchemaWithTags();
                schemaBoth.setName("schema_with_both_tags");
                schemaBoth.setTitle("с тэгами 'Приказ 10' и 'Приказ 123'");
                schemaBoth.setTags(List.of("Приказ 10", "Приказ 123", "system"));

                return schemaBoth;
            case "с тэгом 'Схема доярки'":
                SchemaDto schemaDoyarka = prepareSchemaWithTags();
                schemaDoyarka.setName("schemaDoyarkaV1");
                schemaDoyarka.setTitle("с тэгом 'Схема доярки'");
                schemaDoyarka.setTags(List.of("Схема доярки"));

                return schemaDoyarka;
            case "с полем типа UUID, в котором указан параметр 'defaultValueWellKnownFormula'":
                SchemaDto schemaWithUuidFiled = prepareSchemaTarget();
                schemaWithUuidFiled.setTableName("dl_with_uuid_filed");
                schemaWithUuidFiled.setName("schemaWithUuidFiled");
                schemaWithUuidFiled.setTitle(
                        "с полем типа UUID, в котором указан параметр 'defaultValueWellKnownFormula'");

                SimplePropertyDto uuidProperty = new SimplePropertyDto();
                uuidProperty.setName("guid");
                uuidProperty.setTitle("guid");
                uuidProperty.setValueType("UUID");
                uuidProperty.setDefaultValueWellKnownFormula("UUID");

                SimplePropertyDto path = new SimplePropertyDto();
                path.setName("path");
                path.setTitle("path");
                path.setValueType("STRING");

                List<SimplePropertyDto> properties = schemaWithUuidFiled.getProperties();
                properties.add(uuidProperty);
                properties.add(path);

                return schemaWithUuidFiled;
            case "Тестовая схема с полем в верхнем регистре":
                SchemaDto incorrectSchema = simpleSchema(schemaTitle);
                incorrectSchema.setName("incorrectSchemaForTestOny");
                incorrectSchema.setTitle("Тестовая схема с полем в верхнем регистре");
                incorrectSchema.setTableName("t_incorrect_for_test");
                incorrectSchema.setGeometryType(MULTI_POLYGON);
                incorrectSchema.setReadOnly(false);

                SimplePropertyDto incorrectField = new SimplePropertyDto();
                incorrectField.setName("FIZ");
                incorrectField.setTitle("Тест");
                incorrectField.setValueType("STRING");

                SimplePropertyDto shape = new SimplePropertyDto();
                shape.setName(DEFAULT_GEOMETRY_COLUMN_NAME);
                shape.setTitle("Геометрия");
                shape.setValueType("GEOMETRY");

                List<SimplePropertyDto> props = incorrectSchema.getProperties();
                props.add(incorrectField);
                props.add(shape);

                return incorrectSchema;
            default:
                return simpleSchema(schemaTitle);
        }
    }

    private static SchemaDto testAllAttributes() {
        return loadSchemaFromResource("all-types-schema.json");
    }

    private static SchemaDto stringTypesSchema() {
        return loadSchemaFromResource("string-types-schema.json");
    }

    private static SchemaDto testPointAttributes() {
        return loadSchemaFromResource("point-attributes-schema.json");
    }

    private static SchemaDto testPointAttributesIncorrect() {
        return loadSchemaFromResource("point-attributes-incorrect-schema.json");
    }

    private static SchemaDto testFtsHiddenFieldsSchema() {
        return loadSchemaFromResource("fts-hidden-fields-schema.json");
    }

    private static SchemaDto prepareSchemaWithCalculatedValueFormulaAndValidationFormula() {
        return loadSchemaFromResource("calculated-formula-schema.json");
    }

    private static SchemaDto prepareSchemaSource() {
        return loadSchemaFromResource("source-schema.json");
    }

    private static SchemaDto dlDefaultSchema() {
        return loadSchemaFromResource("dl-default-schema.json");
    }

    private static SchemaDto prepareSchemaTarget() {
        return loadSchemaFromResource("target-schema.json");
    }

    private static SchemaDto prepareSchemaWithTags() {
        return loadSchemaFromResource("tags-schema.json");
    }

    private static SchemaDto prepareTaskSchema() {
        return loadSchemaFromResource("tasks-schema.json");
    }

    private static SchemaDto prepareFunctionalZoneWithTerrRf_SubRfFormulaWithRequiredField() {
        return loadSchemaFromResource("functional-zone-with-required-field-schema.json");
    }

    private static SchemaDto prepareFunctionalZoneWithTerrRf_SubRfFormulaWithNotAllowedFieldType() {
        return loadSchemaFromResource("functional-zone-not-allowed-type-schema.json");
    }

    private static SchemaDto prepareFunctionalZoneWithTerrRfFormulaWithoutRequiredField() {
        return loadSchemaFromResource("functional-zone-base-schema.json");
    }

    private static SchemaDto simpleSchema(String name) {
        SchemaDto schemaDto = loadSchemaFromResource("simple-schema.json");
        schemaDto.setName(name);

        return schemaDto;
    }
}
