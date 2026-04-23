package ru.mycrg.data_service.service.schemas;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.SchemaTemplateProjection;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.mappers.SchemaEntityMapper;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.schemas.SchemaUtil.SYSTEM_TAG_NAME;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.enrichPropsBySystemAttributes;
import static ru.mycrg.data_service_contract.enums.ValueType.URL;

@Service
public class SchemaTemplateServiceBase implements ISchemaTemplateService {

    private final SchemaTemplateRepository schemaRepository;

    public SchemaTemplateServiceBase(SchemaTemplateRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    @Override
    public List<SchemaDto> getSchemas(@Nullable List<String> featureNames) {
        return getSchemaTemplates(featureNames).stream()
                                               .map(SchemaEntityMapper::mapToSchemaDto)
                                               .filter(Objects::nonNull)
                                               .collect(Collectors.toList());
    }

    @Override
    public List<SchemaTemplateProjection> getSchemaTemplatesProjection(@Nullable List<String> featureNames) {
        return getSchemaTemplates(featureNames).stream().map(SchemaEntityMapper::mapToProjection)
                                               .collect(Collectors.toList());
    }

    @Override
    public List<SchemaDto> getSchemasWithReglaments() {
        return schemaRepository.findAll().stream()
                               .filter(this::isReglamentsExist)
                               .map(SchemaEntityMapper::mapToSchemaDto)
                               .filter(Objects::nonNull)
                               .collect(Collectors.toList());
    }

    @Override
    public List<SchemaDto> getBySpecificProperty(String propertyName) {
        return schemaRepository.findBySpecificPropertyName(propertyName).stream()
                               .map(SchemaEntityMapper::mapToSchemaDto)
                               .filter(Objects::nonNull)
                               .collect(Collectors.toList());
    }

    @Override
    public List<String> getSystemTags() {
        return schemaRepository.findUniqueTags().stream()
                               .filter(anObject -> !SYSTEM_TAG_NAME.equals(anObject))
                               .collect(Collectors.toList());
    }

    @Override
    public boolean isSchemaExist(String name) {
        return schemaRepository.existsByName(name);
    }

    /**
     * Проверяем у схемы в "properties" наличие поля "valueType":"URL", что является косвенным признаком наличия
     * регламентов
     */
    private boolean isReglamentsExist(SchemaTemplate schemaTemplate) {
        AtomicBoolean isReglamentExist = new AtomicBoolean(false);
        schemaTemplate.getClassRule().get("properties").forEach(props -> {
            JsonNode valueType = props.get("valueType");
            if (valueType != null && valueType.toString().equals("\"" + URL.name() + "\"")) {
                isReglamentExist.set(true);
            }
        });

        return isReglamentExist.get();
    }

    @Override
    public Optional<SchemaDto> getSchemaByName(@NotNull String name) {
        Optional<SchemaDto> oSchema = schemaRepository.findByName(name).stream()
                                                      .findFirst()
                                                      .map(SchemaEntityMapper::mapToSchemaDto);
        if (oSchema.isPresent()) {
            List<SimplePropertyDto> properties = oSchema.get().getProperties();
            enrichPropsBySystemAttributes(properties);
        }

        return oSchema;
    }

    private List<SchemaTemplate> getSchemaTemplates(@Nullable List<String> featureNames) {
        return featureNames == null || featureNames.isEmpty()
                ? schemaRepository.findAll().stream()
                                  .filter(Objects::nonNull)
                                  .collect(Collectors.toList())
                : schemaRepository.findByNameIn(featureNames).stream()
                                  .filter(Objects::nonNull)
                                  .collect(Collectors.toList());
    }
}
