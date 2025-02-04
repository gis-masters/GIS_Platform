package ru.crg.gisogd_service.converter;

import java.io.IOException;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

/**
 * Deserializer for classId field dataSection ( "doc_13.01" -> "13.01").
 * @author Vladimir Nomokonov
 */
public class Reference2ADeserializer extends JsonDeserializer<String> {

    @Override
    public String deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        String value = jsonParser.getText().trim();
        return value.replaceAll("doc_", "");
    }
}
