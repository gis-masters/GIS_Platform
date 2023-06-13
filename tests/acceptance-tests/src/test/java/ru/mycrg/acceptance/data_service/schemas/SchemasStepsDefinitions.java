package ru.mycrg.acceptance.data_service.schemas;

import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.schemas.SchemaDto;
import ru.mycrg.acceptance.data_service.dto.schemas.SimplePropertyDto;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class SchemasStepsDefinitions extends BaseStepsDefinitions {

    public static String currentSchemaName;

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        String basePath = "/api/data/schemas";

        return super.getBaseRequestWithCurrentCookie()
                    .basePath(basePath);
    }

    @When("Существует некая схема")
    public void createSomeSchema() {
        createSchema();
    }

    @When("Существует схема для библиотеки документов")
    public void createSomeSchemaForDocumentLibrary() {
        createSchema();
    }

    @When("Существует схема {string}")
    public void createSchemaWithCalculatedValueFormula(String schemaTemplate) {
        fromPreparedSchemas(schemaTemplate);
    }

    @When("Пользователь отправляет POST запрос на создание новой схемы")
    public void createNewSchemaPost() {
        createSchema();
    }

    @When("Пользователь создает новую схему")
    public void createNewSchema() {
        createSchema();
    }

    @When("Пользователь делает PUT запрос на обновление существующей схемы")
    public void updateCurrentSchemaRequest() {
        SchemaDto dto = prepareSomeSchema(currentSchemaName);
        dto.setReadOnly(false);

        updateCurrentSchema(dto);
    }

    @When("Схема создана и доступна для выборки")
    public void checkCreatedSchema() {
        getCurrentSchema();

        boolean isPresent = response.jsonPath()
                                    .getList("", SchemaDto.class)
                                    .stream()
                                    .anyMatch(schemaDto -> schemaDto.getName().equals(currentSchemaName));

        assertTrue(isPresent);
    }

    @When("Схема обновлена успешно")
    public void checkUpdatedSchema() {
        getCurrentSchema();

        boolean isSchemaReadonly = response.jsonPath()
                                           .getList("", SchemaDto.class)
                                           .stream()
                                           .filter(schemaDto -> schemaDto.getName().equals(currentSchemaName))
                                           .anyMatch(SchemaDto::isReadOnly);

        assertFalse(isSchemaReadonly);
    }

    private void getCurrentSchema() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?schemaIds=" + currentSchemaName);
    }

    private void createSchema() {
        currentSchemaName = generateString("STRING_8");

        SchemaDto dto = prepareSomeSchema(currentSchemaName);

        super.createEntity(dto);
    }

    private void fromPreparedSchemas(String schemaTemplate) {
        switch (schemaTemplate) {
            case "Тестовая схема V1":
                SchemaDto schema0 = prepareHardcodedDefaultSchema();
                schema0.setTitle("Тестовая схема V1");

                createSchema(schema0);

                break;
            case "rule_id_terr_Rf_subRf без требуемых полей":
                SchemaDto schema1 = prepareFunctionalZoneWithTerrRfFormulaWithoutRequiredField();
                schema1.setTitle("rule_id_terr_Rf_subRf без требуемых полей");

                createSchema(schema1);

                break;
            case "rule_id_terr_Rf_subRf с неподходящими типами полей":
                SchemaDto schema2 = prepareFunctionalZoneWithTerrRf_SubRfFormulaWithNotAllowedFieldType();
                schema2.setTitle("rule_id_terr_Rf_subRf с неподходящими типами полей");

                createSchema(schema2);

                break;
            case "rule_id_terr_Rf_subRf":
                SchemaDto schema3 = prepareFunctionalZoneWithTerrRf_SubRfFormulaWithRequiredField();
                schema3.setTitle("rule_id_terr_Rf_subRf");

                createSchema(schema3);

                break;
            case "с калькулируемыми формулами":
                SchemaDto schema = prepareFunctionalZoneWithCalculatedFields();
                schema.setTitle("с калькулируемыми формулами");

                createSchema(schema);

                break;
            case "тест копирования - схема поставщика":
                SchemaDto sourceSchema = prepareSchemaSource();
                sourceSchema.setTitle("тест копирования - схема поставщика");

                createSchema(sourceSchema);

                break;
            case "тест копирования - схема потребителя":
                SchemaDto targetSchema = prepareSchemaTarget();
                targetSchema.setTitle("тест копирования - схема потребителя");

                createSchema(targetSchema);

                break;
            default:
                throw new IllegalStateException("Unknown schema: " + schemaTemplate);
        }
    }

    private void createSchema(SchemaDto dto) {
        currentSchemaName = dto.getName();
        scenarioSchemas.put(dto.getTitle(), dto);

        super.createEntity(dto);

        if (response.statusCode() == 409) {
            System.out.println("Схема уже существует, обновим");

            updateCurrentSchema(dto);
        } else if (response.statusCode() != 201) {
            throw new IllegalStateException("Не удалось создать схему: " + dto.getName());
        }
    }

    public void updateCurrentSchema(SchemaDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        put()
                .then().
                        log().ifError().
                        extract().response();
    }

    private SchemaDto prepareSomeSchema(String name) {
        List<SimplePropertyDto> properties = new ArrayList<>();
        SimplePropertyDto firstProperty = new SimplePropertyDto();
        firstProperty.setName("firstProperty");
        firstProperty.setTitle("firstPropertyTitle");
        firstProperty.setValueType("STRING");

        properties.add(firstProperty);

        SchemaDto dto = new SchemaDto();
        dto.setName(name);
        dto.setTitle("someTitle");
        dto.setTableName("someTableName");
        dto.setProperties(properties);
        dto.setReadOnly(true);

        return dto;
    }

    private SchemaDto prepareFunctionalZoneWithCalculatedFields() {
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

    private SchemaDto prepareSchemaSource() {
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
    
    private SchemaDto prepareHardcodedDefaultSchema() {
        return gson.fromJson(
                "{" +
                        "  \"name\": \"dl_default_schema\"," +
                        "  \"title\": \"Тестовая схема V1\"," +
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

    private SchemaDto prepareSchemaTarget() {
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

    private SchemaDto prepareFunctionalZoneWithTerrRfFormulaWithoutRequiredField() {
        currentSchemaName = "fun_zone_wellknownformula_without_required_field";

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

        SchemaDto dto = new SchemaDto();
        dto.setName(currentSchemaName);
        dto.setTableName(currentSchemaName);
        dto.setGeometryType("MultiPolygon");
        dto.setReadOnly(false);
        dto.setProperties(properties);

        return dto;
    }

    private SchemaDto prepareFunctionalZoneWithTerrRf_SubRfFormulaWithRequiredField() {
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

    private SchemaDto prepareFunctionalZoneWithTerrRf_SubRfFormulaWithNotAllowedFieldType() {
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
}
