package ru.mycrg.geo_json.jackson;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import ru.mycrg.geo_json.LngLatAlt;

import java.io.IOException;

public class LngLatAltSerializer extends JsonSerializer<LngLatAlt> {

    @Override
    public void serialize(LngLatAlt value, JsonGenerator jgen, SerializerProvider provider) throws IOException {
        jgen.writeStartArray();
        jgen.writeNumber(value.getLongitude());
        jgen.writeNumber(value.getLatitude());
        if (value.hasAltitude()) {
            jgen.writeNumber(value.getAltitude());

            for (double d: value.getAdditionalElements()) {
                jgen.writeNumber(d);
            }
        }

        jgen.writeEndArray();
    }
}
