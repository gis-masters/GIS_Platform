package ru.mycrg.auth_service.service.organization.settings;

import org.junit.jupiter.api.Test;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValueTitleProjection;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static ru.mycrg.auth_service.service.organization.settings.SettingsUtil.buildSchema;

public class BuildOrgSettingsSchemaTest {

    private final OrgSettingsSchemaHolder settingsSchemaHolder = new OrgSettingsSchemaHolder();

    @Test
    void returnEmptySchema_thenSettingsEmpty() {
        assertTrue(
                buildSchema(settingsSchemaHolder.getSchema(), new OrgSettingsResponseDto())
                        .getProperties()
                        .isEmpty());
    }

    // | Название         | Настройки           | Свойство попадает |
    // |                  | сис. администратора | в схему           |
    // --------------------------------------------------------------------
    // | editProjectLayer | true                | true              | Разрешено сис. администратором
    // | taskManagement   | true                | true              | Разрешено сис. администратором
    // | downloadXml      | -                   | false             | Отсутствие воспринимается как запрет
    // | createProject    | false               | false             | Запрещено сис. администратора
    // | unknownProperty1 | true                | false             | "Левые" свойства удаляются
    @Test
    void commonBooleanCases() {
        // Arrange
        Map<String, Object> systemSettings = new HashMap<>();
        systemSettings.put("editProjectLayer", true);
        systemSettings.put("taskManagement", true);
        systemSettings.put("createProject", false);
        systemSettings.put("unknownProperty1", true);

        Map<String, Object> orgSettings = new HashMap<>();
        orgSettings.put("createProject", true);
        orgSettings.put("taskManagement", false);
        orgSettings.put("unknownProperty1", true);

        // Act
        SchemaDto schema = buildSchema(settingsSchemaHolder.getSchema(),
                                       new OrgSettingsResponseDto(1L, systemSettings, orgSettings));
        Set<String> resultProps = schema.getProperties().stream()
                                        .map(SimplePropertyDto::getName)
                                        .collect(Collectors.toSet());

        // Assert
        assertTrue(resultProps.contains("editProjectLayer"));
        assertTrue(resultProps.contains("taskManagement"));

        assertFalse(resultProps.contains("downloadXml"));
        assertFalse(resultProps.contains("createProject"));
        assertFalse(resultProps.contains("unknownProperty1"));
    }

    @Test
    void commonTagsCases() {
        // Arrange
        ValueTitleProjection allowedTag = new ValueTitleProjection("Тег_1", "Тег_1");
        ValueTitleProjection blockedOrgAdminTag = new ValueTitleProjection("Тег_2", "Тег_2");
        ValueTitleProjection blockedSystemAdminTag = new ValueTitleProjection("Тег_3", "Тег_3");
        ValueTitleProjection notExistInSchemaTag = new ValueTitleProjection("Тег_4", "Тег_4");

        SimplePropertyDto tags = new SimplePropertyDto();
        tags.setName("tags");
        tags.setEnumerations(List.of(allowedTag, blockedOrgAdminTag, blockedSystemAdminTag));

        SchemaDto schema = settingsSchemaHolder.getSchema();
        schema.addProperty(tags);

        Map<String, Object> systemSettings = new HashMap<>();
        systemSettings.put("tags", List.of(allowedTag.getTitle(),
                                           blockedOrgAdminTag.getTitle(),
                                           notExistInSchemaTag.getTitle()));

        Map<String, Object> orgSettings = new HashMap<>();
        orgSettings.put("tags", List.of(allowedTag.getTitle(),
                                        blockedSystemAdminTag.getTitle(),
                                        notExistInSchemaTag.getTitle()));

        // Act
        SchemaDto resultSchema = buildSchema(schema,
                                             new OrgSettingsResponseDto(1L, systemSettings, orgSettings));
        Optional<SimplePropertyDto> oTags = resultSchema.getProperties().stream()
                                                        .filter(propertyDto -> propertyDto.getName().equals("tags"))
                                                        .findFirst();

        // Assert
        assertTrue(oTags.isPresent());

        SimplePropertyDto resultTags = oTags.get();

        assertTrue(resultTags.getEnumerations().contains(allowedTag));
        assertTrue(resultTags.getEnumerations().contains(blockedOrgAdminTag));

        assertFalse(resultTags.getEnumerations().contains(blockedSystemAdminTag));
        assertFalse(resultTags.getEnumerations().contains(notExistInSchemaTag));
    }
}
