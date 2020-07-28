package ru.mycrg.gis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.entity.DataSchemaDescription;
import ru.mycrg.gis.exceptions.NotFoundException;
import ru.mycrg.gis.repository.DataSchemaRepository;
import ru.mycrg.mq_queue_contract.SchemaDto;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SchemaService {

    private static Logger log = LoggerFactory.getLogger(SchemaService.class);

    private ObjectMapper mapper = new ObjectMapper();

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

    public Optional<SchemaDto> getSchemaByLayerName(@NotNull String name) {
        final DataSchemaDescription schemaDescription = schemaRepository.findByName(name).stream()
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Not found schema by name:" + name));

        return Optional.ofNullable(mapToSchemaDto(schemaDescription));
    }

    public void checkFeatureByName(String name) {
        schemaRepository
                .findByName(name).stream()
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Not found schema by name:" + name));
    }

    private SchemaDto mapToSchemaDto(DataSchemaDescription dataSchemaDescription) {
        try {
            JsonNode classRule = dataSchemaDescription.getClassRule();

            final SchemaDto schemaDto = mapper.readValue(classRule.toString(), SchemaDto.class);

            schemaDto.setCustomRuleFunction(dataSchemaDescription.getCustomRule());
            schemaDto.setCalcFiledFunction(dataSchemaDescription.getCalculatedFields());

            return schemaDto;
        } catch (IOException e) {
            log.warn("Failed convert JSON / Error: {}", e.getMessage());
        }

        return null;
    }

}
