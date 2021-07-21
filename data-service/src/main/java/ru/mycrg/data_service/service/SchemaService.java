package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.repository.DataSchemaRepository;
import ru.mycrg.data_service.util.SchemaHandler;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.JsonConverter.toJsonNode;

@Service
public class SchemaService {

    private final DataSchemaRepository schemaRepository;
    private final SchemaHandler schemaHandler;

    public SchemaService(DataSchemaRepository schemaRepository, SchemaHandler schemaHandler) {
        this.schemaRepository = schemaRepository;
        this.schemaHandler = schemaHandler;
    }

    public List<SchemaDto> getSchemas(List<String> featureNames) {
        if (featureNames.isEmpty()) {
            return schemaRepository.findAll().stream()
                                   .map(schemaHandler::mapToSchemaDto)
                                   .collect(Collectors.toList());
        } else {
            return schemaRepository.findByNameIn(featureNames).stream()
                                   .map(schemaHandler::mapToSchemaDto)
                                   .collect(Collectors.toList());
        }
    }

    public Optional<SchemaDto> getSchemaByName(@NotNull String name) {
        return schemaRepository.findByName(name).stream()
                               .findFirst()
                               .map(schemaHandler::mapToSchemaDto);
    }

    public boolean isSchemaExist(String name) {
        return schemaRepository.findByName(name).stream()
                               .findFirst()
                               .isPresent();
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
                if (!schemaHandler.isPropertyExist(schema, key)) {
                    throw new BadRequestException("Property: '" + key + "' not exist in schema: " + schemaName);
                }
            });
        });
    }
}
