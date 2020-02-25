package ru.mycrg.gis_service.json;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Component;

import javax.json.Json;
import javax.json.JsonMergePatch;
import javax.json.JsonReader;

import static ru.mycrg.gis_service.config.MediaTypes.APPLICATION_MERGE_PATCH_VALUE;

@Component
public class JsonMergePatchHttpMessageConverter extends AbstractHttpMessageConverter<JsonMergePatch> {

    private static Logger log = LoggerFactory.getLogger(JsonMergePatchHttpMessageConverter.class);

    public JsonMergePatchHttpMessageConverter() {
        super(APPLICATION_MERGE_PATCH_VALUE);
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return JsonMergePatch.class.isAssignableFrom(clazz);
    }

    @Override
    protected JsonMergePatch readInternal(@NotNull Class<? extends JsonMergePatch> clazz, HttpInputMessage inputMessage) {
        try (JsonReader reader = Json.createReader(inputMessage.getBody())) {
            return Json.createMergePatch(reader.readValue());
        } catch (Exception e) {
            throw new HttpMessageNotReadableException(e.getMessage(), e.getCause());
        }
    }

    @Override
    protected void writeInternal(JsonMergePatch jsonMergePatch, HttpOutputMessage outputMessage) {
        log.warn("Not implemented JsonPatchHttpMessageConverter.writeInternal");
    }
}
