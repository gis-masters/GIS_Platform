package ru.crg.gisogd_service.converter;

import org.apache.camel.Body;
import org.apache.camel.Handler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.RfGuid;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.mycrg.gisog_service_contract.dto.Document;

@Component
@AllArgsConstructor
public class RfObjectConverter {

    private final DocumentTypeResolver documentTypeResolver;
    private final ObjectMapper objectMapper;

    @Handler
    public <T extends RfGuid> T convert(@Body Document document) {
        ObjectMapper copiedObjectMapper = objectMapper.copy();
        Class<T> rfObjectType = documentTypeResolver.getRfObjectType(document);
        Class<?> rfObjectTypeMixin = documentTypeResolver.getRfObjectTypeMixin(document);
        copiedObjectMapper.addMixIn(rfObjectType, rfObjectTypeMixin);
        return copiedObjectMapper.convertValue(document.getContent(), rfObjectType);
    }
}
