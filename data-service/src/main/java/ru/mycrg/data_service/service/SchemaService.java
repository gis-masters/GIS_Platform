package ru.mycrg.data_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DataSchemaRepository;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.data_service.service.JsonConverter.toJsonNode;

@Service
public class SchemaService {

    private static final Logger log = LoggerFactory.getLogger(SchemaService.class);

    private final DataSchemaRepository schemaRepository;

    public SchemaService(DataSchemaRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    public List<SchemaDto> getSchemas(List<String> featureNames) {
        if (featureNames.isEmpty()) {
            return schemaRepository.findAll().stream()
                                   .map(this::mapToSchemaDto)
                                   .collect(Collectors.toList());
        } else {
            return schemaRepository.findByNameIn(featureNames).stream()
                                   .map(this::mapToSchemaDto)
                                   .collect(Collectors.toList());
        }
    }

    public Optional<SchemaDto> getSchemaByName(@NotNull String name) {
        final Schema schema = schemaRepository
                .findByName(name).stream()
                .findFirst()
                .orElseThrow(() -> new NotFoundException(name));

        return Optional.ofNullable(mapToSchemaDto(schema));
    }

    public boolean isSchemaExist(String name) {
        return schemaRepository.findByName(name).stream()
                               .findFirst()
                               .isPresent();
    }

    private SchemaDto mapToSchemaDto(Schema schema) {
        try {
            JsonNode classRule = schema.getClassRule();

            final SchemaDto schemaDto = mapper.readValue(classRule.toString(), SchemaDto.class);

            schemaDto.setCustomRuleFunction(schema.getCustomRule());
            schemaDto.setCalcFiledFunction(schema.getCalculatedFields());

            return schemaDto;
        } catch (IOException e) {
            log.warn("Failed convert JSON / Error: {}", e.getMessage());
        }

        return null;
    }

    public void create(SchemaDto schemaDto) {
        final String name = schemaDto.getName();
        if (!schemaRepository.findByName(name).isEmpty()) {
            throw new ConflictException("Schema " + name + " already exist");
        }

        final Schema entity = new Schema();
        entity.setName(name);
        entity.setClassRule(toJsonNode(schemaDto));

        schemaRepository.save(entity);
    }

    public void checkObjectBySchema(Map<String, Object> body, String schemaName) {
        getSchemaByName(schemaName).ifPresent(schema -> {
            body.keySet().forEach(key -> {
                if (!isPropertyExist(schema, key)) {
                    throw new BadRequestException("Property: '" + key + "' not exist in schema: " + schemaName);
                }
            });
        });
    }

    private boolean isPropertyExist(SchemaDto schema, String key) {
        return schema.getProperties().stream()
                     .anyMatch(property -> property.getName().equals(key));
    }
}
