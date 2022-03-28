package ru.mycrg.gis_service.json;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Component;

import javax.json.Json;
import javax.json.JsonMergePatch;
import javax.json.JsonReader;

import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@Component
public class JsonMergePatchHttpMessageConverter extends AbstractHttpMessageConverter<JsonMergePatch> {

    private final Logger log = LoggerFactory.getLogger(JsonMergePatchHttpMessageConverter.class);

    public JsonMergePatchHttpMessageConverter() {
        super(MediaType.valueOf(APPLICATION_JSON_MERGE_PATCH));
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return JsonMergePatch.class.isAssignableFrom(clazz);
    }

    @Override
    protected JsonMergePatch readInternal(@NotNull Class<? extends JsonMergePatch> clazz,
                                          HttpInputMessage inputMessage) {
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
