package ru.mycrg.data_service.service.schemas;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.mappers.SchemaEntityMapper;
import ru.mycrg.data_service.repository.DataSchemaRepository;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.schemas.SchemaUtil.enrichPropsBySystemAttributes;
import static ru.mycrg.data_service_contract.enums.ValueType.URL;

@Service
public class SchemaServiceBase implements ISchemaService {

    private final static String SYSTEM_TAG_NAME = "system";

    private final DataSchemaRepository schemaRepository;

    public SchemaServiceBase(DataSchemaRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    @Override
    public List<SchemaDto> getSchemas(@Nullable List<String> featureNames) {
        return (featureNames == null || featureNames.isEmpty())
                ? schemaRepository.findAll().stream()
                                  .map(SchemaEntityMapper::mapToDto)
                                  .collect(Collectors.toList())
                : schemaRepository.findByNameIn(featureNames).stream()
                                  .map(SchemaEntityMapper::mapToDto)
                                  .collect(Collectors.toList());
    }

    @Override
    public Optional<SchemaDto> getSchemaByName(@NotNull String name) {
        Optional<SchemaDto> oSchema = schemaRepository.findByName(name).stream()
                                                      .findFirst()
                                                      .map(SchemaEntityMapper::mapToDto);
        if (oSchema.isPresent()) {
            List<SimplePropertyDto> properties = oSchema.get().getProperties();
            enrichPropsBySystemAttributes(properties);
        }

        return oSchema;
    }

    @Override
    public List<SchemaDto> getSchemasWithReglaments() {
        return schemaRepository.findAll().stream()
                               .filter(this::isReglamentsExist)
                               .map(SchemaEntityMapper::mapToDto)
                               .collect(Collectors.toList());
    }

    @Override
    public List<SchemaDto> getBySpecificProperty(String propertyName) {
        return schemaRepository.findBySpecificPropertyName(propertyName).stream()
                               .map(SchemaEntityMapper::mapToDto)
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
    private boolean isReglamentsExist(Schema schema) {
        AtomicBoolean isReglamentExist = new AtomicBoolean(false);
        schema.getClassRule().get("properties").forEach(props -> {
            JsonNode valueType = props.get("valueType");
            if (valueType != null && valueType.toString().equals("\"" + URL.name() + "\"")) {
                isReglamentExist.set(true);
            }
        });

        return isReglamentExist.get();
    }
}
