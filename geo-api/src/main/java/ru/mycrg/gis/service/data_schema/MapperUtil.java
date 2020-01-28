package ru.mycrg.gis.service.data_schema;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.gis.entity.FeatureDescription;
import ru.mycrg.mq_queue_contract.SchemaDto;

import java.io.IOException;

public class MapperUtil {

    private static Logger log = LoggerFactory.getLogger(MapperUtil.class);

    private static ObjectMapper mapper = new ObjectMapper();

    public static SchemaDto mapXsdRuleToFeatureDescriptionNew(FeatureDescription featureDescription) {
        try {
            JsonNode classRule = featureDescription.getClassRule();
            return mapper.readValue(classRule.toString(), SchemaDto.class);
        } catch (IOException e) {
            log.warn("Failed convert JSON / Error: {}", e.getMessage());
        }

        return new SchemaDto();
    }

    public static JsonNode convertToJsonNode(Object object) {
        try {
            return JacksonUtil.toJsonNode(getJsonString(object));
        } catch (JsonProcessingException e) {
            log.error("Failed convert to jsonNode: {}", e.getMessage());

            return JacksonUtil.toJsonNode("");
        }
    }

    @Nullable
    static private String getJsonString(Object classType) throws JsonProcessingException {
        return mapper.writer()
                .withDefaultPrettyPrinter()
                .writeValueAsString(classType);
    }

}
