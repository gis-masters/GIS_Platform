package ru.mycrg.gis.service.fgistp;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.dto.EntityTypeDto;
import ru.mycrg.gis.entity.XsdRule;

import java.io.IOException;

@Service
public class RuleUtil {

    private static Logger log = LoggerFactory.getLogger(RuleUtil.class);

    @NotNull
    XsdRule mapClassToEntity(EntityType entityType) {
        XsdRule xsdRule = new XsdRule();
        xsdRule.setClassName(entityType.getName());

        try {
            JsonNode jsonNode = JacksonUtil.toJsonNode(getJson(new EntityTypeDto(entityType)));
            xsdRule.setClassRule(jsonNode);
        } catch (Exception e) {
            log.warn("Failed get json for: {} / With error: {}", entityType.getName(), e.getMessage());
        }

        return xsdRule;
    }

    public EntityType mapEntityToClass(XsdRule xsdRule) {
        ObjectMapper mapper = new ObjectMapper();

        try {
            JsonNode classRule = xsdRule.getClassRule();
            EntityTypeDto entityTypeDto = mapper.readValue(classRule.toString(), EntityTypeDto.class);

            return new EntityType(entityTypeDto);
        } catch (IOException e) {
            log.warn("Failed convert JSON / Error: {}", e.getMessage());
        }

        return new EntityType(xsdRule.getClassName());
    }

    @Nullable
    private String getJson(EntityTypeDto classType) throws JsonProcessingException {
        return new ObjectMapper().writer()
                .withDefaultPrettyPrinter()
                .writeValueAsString(classType);
    }
}
