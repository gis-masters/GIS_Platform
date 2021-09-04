package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.repository.DataSchemaRepository;
import ru.mycrg.data_service.util.SchemaMapper;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SchemaUtil.isPropertyExist;

@Service
public class SchemaService {

    private final DataSchemaRepository schemaRepository;
    private final SchemaMapper schemaMapper;

    public SchemaService(DataSchemaRepository schemaRepository,
                         SchemaMapper schemaMapper) {
        this.schemaRepository = schemaRepository;
        this.schemaMapper = schemaMapper;
    }

    public List<SchemaDto> getSchemas(List<String> featureNames) {
        if (featureNames.isEmpty()) {
            return schemaRepository.findAll().stream()
                                   .map(schemaMapper::mapToDto)
                                   .collect(Collectors.toList());
        } else {
            return schemaRepository.findByNameIn(featureNames).stream()
                                   .map(schemaMapper::mapToDto)
                                   .collect(Collectors.toList());
        }
    }

    public Optional<SchemaDto> getSchemaByName(@NotNull String name) {
        return schemaRepository.findByName(name).stream()
                               .findFirst()
                               .map(schemaMapper::mapToDto);
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

    public void throwIfNotMathSchema(String schemaName, Map<String, Object> body) {
        getSchemaByName(schemaName).ifPresentOrElse(schema -> {
            body.keySet().forEach(key -> {
                if (!isPropertyExist(schema, key)) {
                    throw new BadRequestException("Свойства не соответствуют схеме",
                                                  new ErrorInfo(key, "Данное свойство отсутствует в схеме"));
                }
            });
        }, () -> {
            throw new BadRequestException("Не найдена схема: " + schemaName);
        });
    }
}
