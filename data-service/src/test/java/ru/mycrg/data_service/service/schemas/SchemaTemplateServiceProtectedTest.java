package ru.mycrg.data_service.service.schemas;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.mycrg.common_contracts.generated.data_service.SchemaTemplateProjection;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

@ExtendWith(MockitoExtension.class)
class SchemaTemplateServiceProtectedTest {

    @Mock
    private ISchemaTemplateService schemaService;

    @Mock
    private OrgSettingsKeeper orgSettingsKeeper;

    private SchemaTemplateServiceProtected service;

    @BeforeEach
    void setUp() {
        service = new SchemaTemplateServiceProtected(schemaService, orgSettingsKeeper);
    }

    @Test
    void getSchemas_filtersSystemSchemasByAllowedTags() {
        SchemaTemplateProjection allowedSystemSchema = createProjection("allowed-system", true, List.of("allowed-tag"),
                                                                        null, null);
        SchemaTemplateProjection deniedSystemSchema = createProjection("denied-system", true, List.of("denied-tag"),
                                                                       null, null);
        SchemaTemplateProjection regularSchema = createProjection("regular-schema", false, List.of("denied-tag"),
                                                                  null, null);

        when(schemaService.getSchemaTemplatesProjection(null)).thenReturn(
                List.of(allowedSystemSchema, deniedSystemSchema, regularSchema));
        when(orgSettingsKeeper.isTagAllowed("allowed-tag")).thenReturn(true);
        when(orgSettingsKeeper.isTagAllowed("denied-tag")).thenReturn(false);

        List<SchemaDto> result = service.getSchemas(null);

        assertEquals(List.of("allowed-system", "regular-schema"),
                     result.stream().map(SchemaDto::getName).collect(toList()));
        verify(schemaService, never()).getSchemas(any());
    }

    @Test
    void getSchemas_mapsProjectionRulesToDto() {
        when(schemaService.getSchemaTemplatesProjection(null)).thenReturn(
                List.of(createProjection("schema-with-rules", false, List.of(),
                                         "return true;", "return feature;")));

        List<SchemaDto> result = service.getSchemas(null);

        assertEquals(1, result.size());

        SchemaDto schema = result.getFirst();
        assertNotNull(schema);
        assertEquals("schema-with-rules", schema.getName());
        assertEquals("return true;", schema.getCustomRuleFunction());
        assertEquals("return feature;", schema.getCalcFiledFunction());
    }

    @Test
    void getSchemas_allowsSystemSchemaWhenAnyTagIsAllowed() {
        SchemaTemplateProjection systemSchema = createProjection("multi-tag-system-schema", true,
                                                                 List.of("denied-tag", "allowed-tag"),
                                                                 null, null);

        when(schemaService.getSchemaTemplatesProjection(null)).thenReturn(List.of(systemSchema));
        when(orgSettingsKeeper.isTagAllowed("denied-tag")).thenReturn(false);
        when(orgSettingsKeeper.isTagAllowed("allowed-tag")).thenReturn(true);

        List<SchemaDto> result = service.getSchemas(null);

        assertEquals(1, result.size());
        assertEquals("multi-tag-system-schema", result.getFirst().getName());
    }

    @Test
    void getSchemaTemplatesProjection_filtersSystemSchemasByAllowedTags() {
        SchemaTemplateProjection allowedSystemSchema = createProjection("allowed-system", true, List.of("allowed-tag"),
                                                                        null, null);
        SchemaTemplateProjection deniedSystemSchema = createProjection("denied-system", true, List.of("denied-tag"),
                                                                       null, null);
        SchemaTemplateProjection regularSchema = createProjection("regular-schema", false, List.of("denied-tag"),
                                                                  null, null);

        when(schemaService.getSchemaTemplatesProjection(null)).thenReturn(
                List.of(allowedSystemSchema, deniedSystemSchema, regularSchema));
        when(orgSettingsKeeper.isTagAllowed("allowed-tag")).thenReturn(true);
        when(orgSettingsKeeper.isTagAllowed("denied-tag")).thenReturn(false);

        List<SchemaTemplateProjection> result = service.getSchemaTemplatesProjection(null);

        assertEquals(List.of("allowed-system", "regular-schema"),
                     result.stream().map(SchemaTemplateProjection::getName).collect(toList()));
    }

    @Test
    void getSchemaTemplatesProjection_allowsSystemSchemaWithoutTags() {
        SchemaTemplateProjection projection = createProjection("system-without-tags", true, List.of(), null, null);

        when(schemaService.getSchemaTemplatesProjection(null)).thenReturn(List.of(projection));

        List<SchemaTemplateProjection> result = service.getSchemaTemplatesProjection(null);

        assertEquals(1, result.size());
        assertEquals("system-without-tags", result.getFirst().getName());
        verify(orgSettingsKeeper, never()).isTagAllowed(anyString());
    }

    @Test
    void getSchemaTemplatesProjection_filtersProjectionWithNullClassRule() {
        SchemaTemplateProjection projection = new SchemaTemplateProjection();
        projection.setName("broken-schema");
        projection.setSystem(true);

        when(schemaService.getSchemaTemplatesProjection(null)).thenReturn(List.of(projection));

        List<SchemaTemplateProjection> result = service.getSchemaTemplatesProjection(null);

        assertEquals(0, result.size());
    }

    @Test
    void getSchemas_filtersProjectionWithNullClassRule() {
        SchemaTemplateProjection projection = new SchemaTemplateProjection();
        projection.setName("broken-schema");
        projection.setSystem(false);

        when(schemaService.getSchemaTemplatesProjection(null)).thenReturn(List.of(projection));

        List<SchemaDto> result = service.getSchemas(null);

        assertEquals(0, result.size());
    }

    private SchemaTemplateProjection createProjection(String name,
                                                      boolean isSystem,
                                                      List<String> tags,
                                                      String customRule,
                                                      String calculatedFields) {
        SchemaDto schema = new SchemaDto();
        schema.setName(name);
        schema.setTags(tags);

        SchemaTemplateProjection projection = new SchemaTemplateProjection();
        projection.setName(name);
        projection.setClassRule(toJsonNode(schema));
        projection.setSystem(isSystem);
        projection.setCustomRule(customRule);
        projection.setCalculatedFields(calculatedFields);

        return projection;
    }
}
