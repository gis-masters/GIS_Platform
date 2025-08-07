package ru.mycrg.acceptance.data_service.schemas;

import ru.mycrg.acceptance.data_service.dto.schemas.SchemaDto;
import ru.mycrg.acceptance.data_service.dto.schemas.SimplePropertyDto;

import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.acceptance.BaseStepsDefinitions.gson;

public class SchemaTemplates {

    public static SchemaDto getSchemaTemplateByTitle(String schemaTitle) {
        switch (schemaTitle) {
            case "tasks_schema_v1":
                return prepareTaskSchema();
            case "Точечный слой с атрибутами":
                return testPointAttributes();
            case "Точечный слой с атрибутами - ошибочная, для теста":
                return testPointAttributesIncorrect();
            case "Точечный слой с атрибутами - исправленная":
                SchemaDto correctTestPointSchema = testPointAttributes();
                correctTestPointSchema.setTitle("Точечный слой с атрибутами - исправленная");

                List<SimplePropertyDto> ctpsProperties = correctTestPointSchema.getProperties();
                SimplePropertyDto ruleId = new SimplePropertyDto();
                ruleId.setName("ruleid");
                ruleId.setTitle("Идентификатор стиля");
                ruleId.setValueType("STRING");

                SimplePropertyDto objectId = new SimplePropertyDto();
                objectId.setName("objectid");
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
                SchemaDto schema = prepareFunctionalZoneWithCalculatedFields();
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
                incorrectSchema.setGeometryType("MultiPolygon");
                incorrectSchema.setReadOnly(false);

                SimplePropertyDto incorrectField = new SimplePropertyDto();
                incorrectField.setName("FIZ");
                incorrectField.setTitle("Тест");
                incorrectField.setValueType("STRING");

                SimplePropertyDto shape = new SimplePropertyDto();
                shape.setName("shape");
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

    private static SchemaDto testPointAttributes() {
        return gson.fromJson(
                "{" +
                        "  \"name\": \"nto_all_point\"," +
                        "  \"title\": \"Точечный слой с атрибутами\"," +
                        "  \"styleName\": \"generic\"," +
                        "  \"tableName\": \"nto_all_point\"," +
                        "  \"properties\": [" +
                        "    {\n" +
                        "      \"name\": \"number\",\n" +
                        "      \"title\": \"Номер на схеме\",\n" +
                        "      \"valueType\": \"INT\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"user_id\",\n" +
                        "      \"title\": \"Нащальника\",\n" +
                        "      \"valueType\": \"USER_ID\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"guid\",\n" +
                        "      \"title\": \"ВсемирныйУникал\",\n" +
                        "      \"valueType\": \"UUID\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"location\",\n" +
                        "      \"title\": \"Местоположение\",\n" +
                        "      \"maxLength\": 400,\n" +
                        "      \"valueType\": \"STRING\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"specialty\",\n" +
                        "      \"title\": \"Специализация\",\n" +
                        "      \"valueType\": \"STRING\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"status\",\n" +
                        "      \"title\": \"Период функционирования НТО\",\n" +
                        "      \"valueType\": \"STRING\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"area_doc\",\n" +
                        "      \"title\": \"Площадь, м.кв.\",\n" +
                        "      \"valueType\": \"DOUBLE\",\n" +
                        "      \"fractionDigits\": 6\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"created_at\",\n" +
                        "      \"title\": \"Дата создания\",\n" +
                        "      \"valueType\": \"DATETIME\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"last_modified\",\n" +
                        "      \"title\": \"Дата модификации\",\n" +
                        "      \"valueType\": \"DATETIME\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"updated_by\",\n" +
                        "      \"title\": \"Кто обновил\",\n" +
                        "      \"maxLength\": 50,\n" +
                        "      \"valueType\": \"STRING\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"created_by\",\n" +
                        "      \"title\": \"Создатель\",\n" +
                        "      \"maxLength\": 50,\n" +
                        "      \"valueType\": \"STRING\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"shape\",\n" +
                        "      \"title\": \"shape\",\n" +
                        "      \"hidden\": true,\n" +
                        "      \"valueType\": \"GEOMETRY\",\n" +
                        "      \"allowedValues\": [\n" +
                        "        \"Point\"\n" +
                        "      ]\n" +
                        "    }\n" +
                        "  ],\n" +
                        "  \"description\": \"Точечный слой с атрибутами\",\n" +
                        "  \"geometryType\": \"Point\"\n" +
                        "}", SchemaDto.class);
    }

    private static SchemaDto testPointAttributesIncorrect() {
        return gson.fromJson(
                "{" +
                        "  \"name\": \"nto_all_point_incorrect\"," +
                        "  \"title\": \"Точечный слой с атрибутами - ошибочная, для теста\"," +
                        "  \"styleName\": \"generic\"," +
                        "  \"tableName\": \"nto_all_point_incorrect\"," +
                        "  \"properties\": [" +
                        "    {" +
                        "      \"name\": \"location\"," +
                        "      \"title\": \"Местоположение\"," +
                        "      \"length\": 1000," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"user_id\"," +
                        "      \"title\": \"Нащальника\"," +
                        "      \"valueType\": \"INT\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"guid\"," +
                        "      \"title\": \"ВсемирныйУникал\"," +
                        "      \"valueType\": \"INT\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"specialty_new\"," +
                        "      \"title\": \"Специализация\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {\n" +
                        "      \"name\": \"status\",\n" +
                        "      \"title\": \"Период функционирования НТО\",\n" +
                        "      \"valueType\": \"STRING\"\n" +
                        "    },\n" +
                        "    {" +
                        "      \"name\": \"area_doc\"," +
                        "      \"title\": \"Площадь, м.кв.\"," +
                        "      \"valueType\": \"INT\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"created_at\"," +
                        "      \"title\": \"Дата создания\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {\n" +
                        "      \"name\": \"last_modified\",\n" +
                        "      \"title\": \"Дата модификации\",\n" +
                        "      \"valueType\": \"DATETIME\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"updated_by\",\n" +
                        "      \"title\": \"Кто обновил\",\n" +
                        "      \"length\": 500,\n" +
                        "      \"valueType\": \"STRING\"\n" +
                        "    },\n" +
                        "    {" +
                        "      \"name\": \"created_by\"," +
                        "      \"title\": \"Создатель\"," +
                        "      \"maxLength\": 20," +
                        "      \"valueType\": \"STRING\"" +
                        "    }" +
                        "  ]," +
                        "  \"description\": \"Точечный слой с атрибутами\"," +
                        "  \"geometryType\": \"Point\"" +
                        "}", SchemaDto.class);
    }

    private static SchemaDto testFtsHiddenFieldsSchema() {
        return gson.fromJson(
                "{" +
                        "  \"name\": \"schema_for_test_fts_hidden-fields\"," +
                        "  \"title\": \"Тест FTS - исключение hidden полей\"," +
                        "  \"tableName\": \"test_fts_hidden_fields\"," +
                        "  \"styleName\": \"generic\"," +
                        "  \"readOnly\": false," +
                        "  \"geometryType\": \"MultiPolygon\"," +
                        "  \"properties\": [" +
                        "    {" +
                        "      \"name\": \"field_1\"," +
                        "      \"title\": \"Строка 1\"," +
                        "      \"description\": \"Строка участвующая в полнотекстовом поиске\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_2\"," +
                        "      \"title\": \"Строка 2\"," +
                        "      \"description\": \"Скрытая строка - НЕ должна участвовать в полнотекстовом поиске\"," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"hidden\": true" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"shape\"," +
                        "      \"title\": \"Геометрия\"," +
                        "      \"hidden\": true," +
                        "      \"valueType\": \"GEOMETRY\"," +
                        "      \"allowedValues\": [" +
                        "        \"MultiPolygon\"" +
                        "      ]" +
                        "    }" +
                        "  ]" +
                        "}", SchemaDto.class);
    }

    private static SchemaDto prepareFunctionalZoneWithCalculatedFields() {
        return gson.fromJson(
                "{" +
                        "  \"name\": \"functionalzone_test\"," +
                        "  \"title\": \"Функциональные зоны тест\"," +
                        "  \"readOnly\": false," +
                        "  \"tableName\": \"test_sorting__v1\"," +
                        "  \"styleName\": \"generic\"," +
                        "  \"geometryType\": \"MultiPolygon\"," +
                        "  \"properties\": [" +
                        "    {" +
                        "      \"name\": \"globalid\"," +
                        "      \"title\": \"Идентификатор объекта\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"name\"," +
                        "      \"title\": \"Наименование объекта\"," +
                        "      \"calculatedValueFormula\": \"return obj.name + '!!!'\"," +
                        "      \"validationFormula\": \"return 'error'\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"area\"," +
                        "      \"title\": \"Площадь, га\"," +
                        "      \"valueType\": \"DOUBLE\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"population\"," +
                        "      \"title\": \"Численность населения, чел.\"," +
                        "      \"valueType\": \"INT\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"shape\"," +
                        "      \"title\": \"Геометрия\"," +
                        "      \"valueType\": \"GEOMETRY\"" +
                        "    }" +
                        "  ]" +
                        "}", SchemaDto.class);
    }

    private static SchemaDto prepareSchemaSource() {
        return gson.fromJson(
                "{" +
                        "  \"name\": \"schemaForTestCopy_producer\"," +
                        "  \"title\": \"Схема для тестирования копирования: поставщик\"," +
                        "  \"readOnly\": false," +
                        "  \"tableName\": \"copy_test_producer\"," +
                        "  \"styleName\": \"generic\"," +
                        "  \"geometryType\": \"MultiPolygon\"," +
                        "  \"properties\": [" +
                        "    {" +
                        "      \"name\": \"field_1\"," +
                        "      \"title\": \"area_generated_1\"," +
                        "      \"valueType\": \"DOUBLE\"," +
                        "      \"calculatedValueWellKnownFormula\": \"st_area\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_2\"," +
                        "      \"title\": \"area_generated_2\"," +
                        "      \"valueType\": \"DOUBLE\"," +
                        "      \"calculatedValueWellKnownFormula\": \"st_area\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_3\"," +
                        "      \"title\": \"Поверхностные водные объекты\"," +
                        "      \"valueType\": \"CHOICE\"," +
                        "      \"enumerations\": [" +
                        "        {" +
                        "          \"title\": \"first option\"," +
                        "          \"value\": \"1\"" +
                        "        }," +
                        "        {" +
                        "          \"title\": \"second option\"," +
                        "          \"value\": \"2\"" +
                        "        }" +
                        "      ]" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_4\"," +
                        "      \"title\": \"Поверхностные водные объекты\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"shape\"," +
                        "      \"title\": \"Поле для геометрии\"," +
                        "      \"valueType\": \"GEOMETRY\"" +
                        "    }" +
                        "  ]" +
                        "}", SchemaDto.class);
    }

    private static SchemaDto dlDefaultSchema() {
        return gson.fromJson(
                "{" +
                        "  \"name\": \"dl_default_schema\"," +
                        "  \"title\": \"Тестовая схема dl_default\"," +
                        "  \"description\": \"documents_schema_v1\"," +
                        "  \"tableName\": \"dl_default\"," +
                        "  \"properties\": [" +
                        "    {" +
                        "      \"name\": \"id\"," +
                        "      \"title\": \"Идентификатор\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"INT\"," +
                        "      \"sequenceNumber\": 0" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"title\"," +
                        "      \"title\": \"Заголовок\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0," +
                        "      \"maxLength\": 500" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"name\"," +
                        "      \"title\": \"Название\"," +
                        "      \"required\": false," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0," +
                        "      \"maxLength\": 254" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"type\"," +
                        "      \"title\": \"Тип\"," +
                        "      \"required\": false," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0," +
                        "      \"maxLength\": 50" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"size\"," +
                        "      \"title\": \"Размер в kb\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"INT\"," +
                        "      \"sequenceNumber\": 0" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"inner_path\"," +
                        "      \"title\": \"Где лежит\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"created_at\"," +
                        "      \"title\": \"Дата создания\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"DATETIME\"," +
                        "      \"sequenceNumber\": 0" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"last_modified\"," +
                        "      \"title\": \"Дата последней модификации\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"DATETIME\"," +
                        "      \"sequenceNumber\": 0" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"created_by\"," +
                        "      \"title\": \"Создатель\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"objectIdentityOnUi\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0," +
                        "      \"maxLength\": 50" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"category\"," +
                        "      \"title\": \"Категории/Теги\"," +
                        "      \"required\": false," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0," +
                        "      \"maxLength\": 254" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"content_type_id\"," +
                        "      \"title\": \"Идентификатор контент типа\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0," +
                        "      \"maxLength\": 50" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"is_folder\"," +
                        "      \"title\": \"Признак раздела\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"BOOLEAN\"," +
                        "      \"sequenceNumber\": 0" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"path\"," +
                        "      \"title\": \"Полный путь, отражающий иерархию обьектов\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"oktmo\"," +
                        "      \"title\": \"ОКТМО\"," +
                        "      \"required\": true," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0," +
                        "      \"maxLength\": 11" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"intents\"," +
                        "      \"title\": \"System intents\"," +
                        "      \"required\": false," +
                        "      \"hidden\": true," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"maxLength\": 500" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"native_crs\"," +
                        "      \"title\": \"nativeCRS\"," +
                        "      \"required\": false," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"sequenceNumber\": 0," +
                        "      \"maxLength\": 11" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"some_files\"," +
                        "      \"title\": \"Any user title here\"," +
                        "      \"required\": false," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"FILE\"," +
                        "      \"multiple\": true" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"one_file\"," +
                        "      \"title\": \"Any user title here\"," +
                        "      \"required\": false," +
                        "      \"hidden\": false," +
                        "      \"valueType\": \"FILE\"," +
                        "      \"multiple\": false" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"test\"," +
                        "      \"title\": \"Not exist in database property\"," +
                        "      \"required\": false," +
                        "      \"hidden\": true," +
                        "      \"valueType\": \"STRING\"," +
                        "      \"maxLength\": 500" +
                        "    }" +
                        "  ]," +
                        "  \"contentTypes\": [" +
                        "    {" +
                        "      \"id\": \"doc_v1\"," +
                        "      \"type\": \"DOCUMENT\"," +
                        "      \"title\": \"Документ первого типа\"," +
                        "      \"icon\": \"DOCUMENT\"," +
                        "      \"attributes\": [" +
                        "        {" +
                        "          \"name\": \"title\"," +
                        "          \"title\": \"Название файла\"," +
                        "          \"required\": true," +
                        "          \"hidden\": false," +
                        "          \"sequenceNumber\": 0," +
                        "          \"maxLength\": 500" +
                        "        }," +
                        "        {" +
                        "          \"name\": \"binary\"," +
                        "          \"title\": \"Выбор файла\"," +
                        "          \"required\": true," +
                        "          \"sequenceNumber\": 2" +
                        "        }," +
                        "        {" +
                        "          \"name\": \"native_crs\"," +
                        "          \"required\": false," +
                        "          \"hidden\": false" +
                        "        }" +
                        "      ]" +
                        "    }," +
                        "    {" +
                        "      \"id\": \"doc_v3\"," +
                        "      \"type\": \"DOCUMENT\"," +
                        "      \"attributes\": [" +
                        "        {" +
                        "          \"name\": \"title\"," +
                        "          \"title\": \"Название файла\"," +
                        "          \"required\": true," +
                        "          \"maxLength\": 100" +
                        "        }" +
                        "      ]" +
                        "    }," +
                        "    {" +
                        "      \"id\": \"doc_v2\"," +
                        "      \"type\": \"DOCUMENT\"," +
                        "      \"title\": \"Документ ГПЗУ\"," +
                        "      \"icon\": \"GPZU\"," +
                        "      \"attributes\": [" +
                        "        {" +
                        "          \"name\": \"title\"," +
                        "          \"title\": \"Название файла\"," +
                        "          \"required\": true," +
                        "          \"hidden\": false," +
                        "          \"sequenceNumber\": 0" +
                        "        }," +
                        "        {" +
                        "          \"name\": \"category\"," +
                        "          \"title\": \"Теги\"," +
                        "          \"required\": true," +
                        "          \"hidden\": false," +
                        "          \"sequenceNumber\": 1" +
                        "        }," +
                        "        {" +
                        "          \"name\": \"binary\"," +
                        "          \"title\": \"Выбор файла\"," +
                        "          \"required\": true," +
                        "          \"sequenceNumber\": 2" +
                        "        }," +
                        "        {" +
                        "          \"name\": \"native_crs\"," +
                        "          \"required\": false," +
                        "          \"hidden\": false," +
                        "          \"sequenceNumber\": 3" +
                        "        }" +
                        "      ]" +
                        "    }," +
                        "    {" +
                        "      \"id\": \"folder_v1\"," +
                        "      \"type\": \"FOLDER\"," +
                        "      \"attributes\": [" +
                        "        {" +
                        "          \"name\": \"title\"" +
                        "        }" +
                        "      ]" +
                        "    }," +
                        "    {" +
                        "      \"id\": \"doc_v4\"," +
                        "      \"type\": \"DOCUMENT\"," +
                        "      \"attributes\": [" +
                        "        {" +
                        "          \"name\": \"title\"," +
                        "          \"title\": \"Название документа\"" +
                        "        }," +
                        "        {" +
                        "          \"name\": \"some_files\"," +
                        "          \"title\": \"Картинки котиков\"" +
                        "        }," +
                        "        {" +
                        "          \"name\": \"one_file\"," +
                        "          \"title\": \"Одинокое фото собаки\"" +
                        "        }" +
                        "      ]" +
                        "    }" +
                        "  ]" +
                        "}", SchemaDto.class);
    }

    private static SchemaDto prepareSchemaTarget() {
        return gson.fromJson(
                "{" +
                        "  \"name\": \"schemaForTestCopy_consumer\"," +
                        "  \"title\": \"Схема для тестирования копирования: подтребитель\"," +
                        "  \"readOnly\": false," +
                        "  \"tableName\": \"copy_test_consumer\"," +
                        "  \"styleName\": \"generic\"," +
                        "  \"geometryType\": \"MultiPolygon\"," +
                        "  \"properties\": [" +
                        "    {" +
                        "      \"name\": \"field_1\"," +
                        "      \"title\": \"area_generated_1\"," +
                        "      \"valueType\": \"DOUBLE\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_2\"," +
                        "      \"title\": \"area_generated_2\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_3\"," +
                        "      \"title\": \"choice->string\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_4\"," +
                        "      \"title\": \"string->choice\"," +
                        "      \"valueType\": \"CHOICE\"," +
                        "      \"enumerations\": [" +
                        "        {" +
                        "          \"title\": \"first option\"," +
                        "          \"value\": \"1\"" +
                        "        }," +
                        "        {" +
                        "          \"title\": \"second option\"," +
                        "          \"value\": \"2\"" +
                        "        }" +
                        "      ]" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"shape\"," +
                        "      \"title\": \"Поле для геометрии\"," +
                        "      \"valueType\": \"GEOMETRY\"" +
                        "    }" +
                        "  ]" +
                        "}", SchemaDto.class);
    }

    private static SchemaDto prepareSchemaWithTags() {
        return gson.fromJson(
                "{" +
                        "  \"name\": \"schemaWithTags\"," +
                        "  \"title\": \"Схема для тестирования тэгов\"," +
                        "  \"readOnly\": false," +
                        "  \"tableName\": \"copy_test_consumer\"," +
                        "  \"styleName\": \"generic\"," +
                        "  \"geometryType\": \"MultiPolygon\"," +
                        "  \"tags\": []," +
                        "  \"properties\": [" +
                        "    {" +
                        "      \"name\": \"field_1\"," +
                        "      \"title\": \"area_generated_1\"," +
                        "      \"valueType\": \"DOUBLE\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_2\"," +
                        "      \"title\": \"area_generated_2\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_3\"," +
                        "      \"title\": \"choice->string\"," +
                        "      \"valueType\": \"STRING\"" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"field_4\"," +
                        "      \"title\": \"string->choice\"," +
                        "      \"valueType\": \"CHOICE\"," +
                        "      \"enumerations\": [" +
                        "        {" +
                        "          \"title\": \"first option\"," +
                        "          \"value\": \"1\"" +
                        "        }," +
                        "        {" +
                        "          \"title\": \"second option\"," +
                        "          \"value\": \"2\"" +
                        "        }" +
                        "      ]" +
                        "    }," +
                        "    {" +
                        "      \"name\": \"shape\"," +
                        "      \"title\": \"Поле для геометрии\"," +
                        "      \"valueType\": \"GEOMETRY\"" +
                        "    }" +
                        "  ]" +
                        "}", SchemaDto.class);
    }

    private static SchemaDto prepareTaskSchema() {
        return gson.fromJson(
                "{\n" +
                        "  \"name\": \"tasks_schema_v1\",\n" +
                        "  \"title\": \"Схема задач специализации 3\",\n" +
                        "  \"tableName\": \"tasks\",\n" +
                        "  \"description\": \"Реестр системных и настраиваемых задач\",\n" +
                        "  \"originName\": \"tasks\",\n" +
                        "  \"styleName\": \"tasks_schema_v1\",\n" +
                        "  \"readOnly\": false,\n" +
                        "  \"geometryType\": \"MultiPolygon\",\n" +
                        "  \"tags\": [\"system\", \"Задачи\"],\n" +
                        "  \"properties\": [\n" +
                        "    {\n" +
                        "      \"name\": \"id\",\n" +
                        "      \"title\": \"Идентификатор\",\n" +
                        "      \"valueType\": \"INT\",\n" +
                        "      \"hidden\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"type\",\n" +
                        "      \"title\": \"Тип задачи\",\n" +
                        "      \"valueType\": \"CHOICE\",\n" +
                        "      \"hidden\": true,\n" +
                        "      \"enumerations\": [\n" +
                        "        {\"value\": \"ASSIGNABLE\", \"title\": \"Назначаемая\"},\n" +
                        "        {\"value\": \"CUSTOM\", \"title\": \"Настраиваемая\"},\n" +
                        "        {\"value\": \"SYSTEM\", \"title\": \"Системная\"}\n" +
                        "      ]\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"content_type_id\",\n" +
                        "      \"title\": \"Вид задачи\",\n" +
                        "      \"valueType\": \"CHOICE\",\n" +
                        "      \"readOnly\": true,\n" +
                        "      \"maxLength\": 50,\n" +
                        "      \"minWidth\": 300,\n" +
                        "      \"enumerations\": [\n" +
                        "        {\"value\": \"common_task_kpt_import\", \"title\": \"Обновление данных в слоях КПТ\"}\n" +
                        "      ]\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"status\",\n" +
                        "      \"title\": \"Статус задачи\",\n" +
                        "      \"valueType\": \"CHOICE\",\n" +
                        "      \"enumerations\": [\n" +
                        "        {\"value\": \"DONE\", \"title\": \"Выполнена\"},\n" +
                        "        {\"value\": \"CANCELED\", \"title\": \"Отменена\"},\n" +
                        "        {\"value\": \"CREATED\", \"title\": \"Создана\"},\n" +
                        "        {\"value\": \"IN_PROGRESS\", \"title\": \"В работе\"}\n" +
                        "      ]\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"description\",\n" +
                        "      \"title\": \"Описание\",\n" +
                        "      \"valueType\": \"STRING\",\n" +
                        "      \"display\": \"multiline\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"assigned_to\",\n" +
                        "      \"title\": \"Исполнитель\",\n" +
                        "      \"valueType\": \"USER_ID\",\n" +
                        "      \"required\": true,\n" +
                        "      \"onlySubordinates\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"owner_id\",\n" +
                        "      \"title\": \"Начальник\",\n" +
                        "      \"valueType\": \"USER_ID\",\n" +
                        "      \"required\": true,\n" +
                        "      \"readOnly\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"inbox_data_key_data_connection\",\n" +
                        "      \"title\": \"Материалы для обработки\",\n" +
                        "      \"valueType\": \"DOCUMENT\",\n" +
                        "      \"required\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"data_section_key_data_connection\",\n" +
                        "      \"title\": \"Связь с библиотеками\",\n" +
                        "      \"valueType\": \"DOCUMENT\",\n" +
                        "      \"multiple\": true,\n" +
                        "      \"libraries\": [\"dl_data_kpt\"],\n" +
                        "      \"maxDocuments\": 18\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"created_by\",\n" +
                        "      \"title\": \"Создано\",\n" +
                        "      \"valueType\": \"STRING\",\n" +
                        "      \"hidden\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"created_at\",\n" +
                        "      \"title\": \"Дата создания\",\n" +
                        "      \"valueType\": \"DATETIME\",\n" +
                        "      \"readOnly\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"due_date\",\n" +
                        "      \"title\": \"Срок исполнения\",\n" +
                        "      \"valueType\": \"DATETIME\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"record_status\",\n" +
                        "      \"title\": \"Контроль скоков исполнения\",\n" +
                        "      \"valueType\": \"CHOICE\",\n" +
                        "      \"readOnly\": true,\n" +
                        "      \"enumerations\": [\n" +
                        "        {\"value\": \"В установленный срок\", \"title\": \"В установленный срок\"},\n" +
                        "        {\"value\": \"С нарушением срока\", \"title\": \"С нарушением срока\"}\n" +
                        "      ]\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"guid\",\n" +
                        "      \"title\": \"guid\",\n" +
                        "      \"valueType\": \"UUID\",\n" +
                        "      \"hidden\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"number\",\n" +
                        "      \"title\": \"Просроченных дней\",\n" +
                        "      \"valueType\": \"INT\",\n" +
                        "      \"readOnly\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"updated_by\",\n" +
                        "      \"title\": \"Модифицировано\",\n" +
                        "      \"valueType\": \"STRING\",\n" +
                        "      \"hidden\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"date\",\n" +
                        "      \"title\": \"Дата выполнения\",\n" +
                        "      \"valueType\": \"DATETIME\",\n" +
                        "      \"readOnly\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"last_modified\",\n" +
                        "      \"title\": \"Дата последнего изменения\",\n" +
                        "      \"valueType\": \"DATETIME\",\n" +
                        "      \"hidden\": true,\n" +
                        "      \"readOnly\": true\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"attachments\",\n" +
                        "      \"title\": \"Вложения\",\n" +
                        "      \"valueType\": \"FILE\",\n" +
                        "      \"multiple\": true\n" +
                        "    }\n" +
                        "  ],\n" +
                        "  \"contentTypes\": [\n" +
                        "    {\n" +
                        "      \"id\": \"common_task_kpt_import\",\n" +
                        "      \"type\": \"DOCUMENT\",\n" +
                        "      \"title\": \"Обновление данных в слоях КПТ\",\n" +
                        "      \"childOnly\": false,\n" +
                        "      \"attributes\": [\n" +
                        "        {\"name\": \"id\", \"hidden\": true},\n" +
                        "        {\"name\": \"content_type_id\", \"hidden\": true},\n" +
                        "        {\"name\": \"status\", \"hidden\": true},\n" +
                        "        {\"name\": \"owner_id\"},\n" +
                        "        {\"name\": \"assigned_to\"},\n" +
                        "        {\"name\": \"due_date\"},\n" +
                        "        {\"name\": \"guid\"},\n" +
                        "        {\"name\": \"created_at\"},\n" +
                        "        {\"name\": \"last_modified\"},\n" +
                        "        {\n" +
                        "          \"name\": \"inbox_data_key_data_connection\",\n" +
                        "          \"title\": \"Библиотека КПТ\",\n" +
                        "          \"multiple\": true,\n" +
                        "          \"libraries\": [\"dl_data_kpt\"],\n" +
                        "          \"maxDocuments\": 10,\n" +
                        "          \"valueType\": \"DOCUMENT\"\n" +
                        "        },\n" +
                        "        {\"name\": \"data_section_key_data_connection\"},\n" +
                        "        {\"name\": \"description\"}\n" +
                        "      ]\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"id\": \"task_with_attachments\",\n" +
                        "      \"type\": \"DOCUMENT\",\n" +
                        "      \"title\": \"Задача с вложениями\",\n" +
                        "      \"attributes\": [\n" +
                        "        {\"name\": \"id\", \"hidden\": true},\n" +
                        "        {\"name\": \"content_type_id\", \"readOnly\": true},\n" +
                        "        {\"name\": \"assigned_to\"},\n" +
                        "        {\"name\": \"description\"},\n" +
                        "        {\"name\": \"attachments\"}\n" +
                        "      ]\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}", SchemaDto.class);
    }

    private static SchemaDto prepareFunctionalZoneWithTerrRf_SubRfFormulaWithRequiredField() {
        String schemaName = "functionalzone_wellknownformula";

        SchemaDto schemaDto = prepareFunctionalZoneWithTerrRfFormulaWithoutRequiredField();
        List<SimplePropertyDto> properties = schemaDto.getProperties();

        SimplePropertyDto classid = new SimplePropertyDto();
        classid.setName("classid");
        classid.setTitle("Класс данных");
        classid.setValueType("INT");

        properties.add(classid);

        schemaDto.setName(schemaName);
        schemaDto.setTableName(schemaName);

        return schemaDto;
    }

    private static SchemaDto prepareFunctionalZoneWithTerrRf_SubRfFormulaWithNotAllowedFieldType() {
        String schemaName = "fz_wellknownformula_with_not_allowed_types";

        SchemaDto schemaDto = prepareFunctionalZoneWithTerrRfFormulaWithoutRequiredField();
        List<SimplePropertyDto> properties = schemaDto.getProperties();

        SimplePropertyDto classid = new SimplePropertyDto();
        classid.setName("classid");
        classid.setTitle("Класс данных");
        classid.setValueType("DOUBLE");

        properties.add(classid);

        schemaDto.setName(schemaName);
        schemaDto.setTableName(schemaName);

        return schemaDto;
    }

    private static SchemaDto prepareFunctionalZoneWithTerrRfFormulaWithoutRequiredField() {
        String currentSchemaName = "fun_zone_wellknownformula_without_required_field";

        List<SimplePropertyDto> properties = new ArrayList<>();
        SimplePropertyDto globalid = new SimplePropertyDto();
        globalid.setName("globalid");
        globalid.setTitle("Идентификатор объекта");
        globalid.setValueType("STRING");

        SimplePropertyDto ruleid = new SimplePropertyDto();
        ruleid.setName("ruleid");
        ruleid.setTitle("Идентификатор стиля");
        ruleid.setValueType("STRING");
        ruleid.setCalculatedValueWellKnownFormula("rule_id_terr_Rf_subRf");

        SimplePropertyDto area = new SimplePropertyDto();
        area.setName("area");
        area.setTitle("Площадь, га");
        area.setValueType("DOUBLE");

        SimplePropertyDto shape = new SimplePropertyDto();
        shape.setName("shape");
        shape.setTitle("Геометрия");
        shape.setValueType("GEOMETRY");

        properties.add(globalid);
        properties.add(ruleid);
        properties.add(area);
        properties.add(shape);

        SchemaDto schemaDto = new SchemaDto();
        schemaDto.setName(currentSchemaName);
        schemaDto.setTableName(currentSchemaName);
        schemaDto.setGeometryType("MultiPolygon");
        schemaDto.setReadOnly(false);
        schemaDto.setProperties(properties);

        return schemaDto;
    }

    private static SchemaDto simpleSchema(String name) {
        List<SimplePropertyDto> properties = new ArrayList<>();
        SimplePropertyDto firstProperty = new SimplePropertyDto();
        firstProperty.setName("firstProperty");
        firstProperty.setTitle("firstPropertyTitle");
        firstProperty.setValueType("STRING");

        SimplePropertyDto secondProperty = new SimplePropertyDto();
        secondProperty.setName("path");
        secondProperty.setTitle("secondPropertyTitle");
        secondProperty.setValueType("STRING");

        properties.add(firstProperty);
        properties.add(secondProperty);

        SchemaDto schemaDto = new SchemaDto();
        schemaDto.setName(name);
        schemaDto.setTitle("someTitle");
        schemaDto.setTableName("some_table_name");
        schemaDto.setProperties(properties);
        schemaDto.setReadOnly(true);

        return schemaDto;
    }
}
