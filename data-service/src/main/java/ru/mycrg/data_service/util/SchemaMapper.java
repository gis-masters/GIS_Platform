package ru.mycrg.data_service.util;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.io.IOException;

import static ru.mycrg.data_service.service.JsonConverter.mapper;

@Service
public class SchemaMapper {

    private final Logger log = LoggerFactory.getLogger(SchemaMapper.class);

    public SchemaDto mapToDto(Schema schema) {
        try {
            JsonNode classRule = schema.getClassRule();

            final SchemaDto schemaDto = mapper.readValue(classRule.toString(), SchemaDto.class);

            schemaDto.setCustomRuleFunction(schema.getCustomRule());
            schemaDto.setCalcFiledFunction(schema.getCalculatedFields());

            return schemaDto;
        } catch (IOException e) {
            String message = "Failed convert JSON / Error: " + e.getMessage();
            log.warn(message);

            throw new DataServiceException(message);
        }
    }
}
