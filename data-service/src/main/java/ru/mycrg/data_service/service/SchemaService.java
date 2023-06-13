package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.mappers.SchemaMapper;
import ru.mycrg.data_service.repository.DataSchemaRepository;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.util.SchemaUtil.isPropertyExist;
import static ru.mycrg.data_service_contract.enums.ValueType.URL;

@Service
public class SchemaService {

    private final DataSchemaRepository schemaRepository;

    public SchemaService(DataSchemaRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    public List<SchemaDto> getSchemas(List<String> featureNames) {
        if (featureNames.isEmpty()) {
            return schemaRepository.findAll().stream()
                                   .map(SchemaMapper::mapToDto)
                                   .collect(Collectors.toList());
        } else {
            return schemaRepository.findByNameIn(featureNames).stream()
                                   .map(SchemaMapper::mapToDto)
                                   .collect(Collectors.toList());
        }
    }

    public List<SchemaDto> getSchemasWithReglaments() {
        return schemaRepository.findAll().stream()
                               .filter(this::isReglamentsExist)
                               .map(SchemaMapper::mapToDto)
                               .collect(Collectors.toList());
    }

    public Optional<SchemaDto> getSchemaByName(@NotNull String name) {
        return schemaRepository.findByName(name).stream()
                               .findFirst()
                               .map(SchemaMapper::mapToDto);
    }

    public boolean isSchemaExist(String name) {
        return schemaRepository.findByName(name).stream()
                               .findFirst()
                               .isPresent();
    }

    public void throwIfNotMatchSchema(String schemaName, Map<String, Object> props) {
        SchemaDto schema = getSchemaByName(schemaName)
                .orElseThrow(() -> new BadRequestException("Не найдена схема: " + schemaName));

        throwIfNotMatchSchema(schema, props);
    }

    public void throwIfNotMatchSchema(SchemaDto schema, Map<String, Object> props) {
        props.keySet().forEach(key -> {
            if (!isPropertyExist(schema, key)) {
                throw new BadRequestException("Свойства не соответствуют схеме",
                                              new ErrorInfo(key, "Данное свойство отсутствует в схеме"));
            }
        });
    }

    @NotNull
    public Map<String, Object> excludeUnknownProperties(SchemaDto schema, Map<String, Object> props) {
        Map<String, Object> result = new HashMap<>();
        props.forEach((key, value) -> {
            if (isPropertyExist(schema, key)) {
                result.put(key, value);
            }
        });

        return result;
    }

    /**
     * Проверяем у схемы в "properties" наличие поля "valueType":"URL", что является косвенным признаком наличия
     * регламентов
     */
    private boolean isReglamentsExist(Schema schema) {
        AtomicBoolean isReglamentExist = new AtomicBoolean(false);
        schema.getClassRule().get("properties").forEach(props -> {
            if (props.get("valueType").toString().equals("\"" + URL.name() + "\"")) {
                isReglamentExist.set(true);
            }
        });

        return isReglamentExist.get();
    }
}
