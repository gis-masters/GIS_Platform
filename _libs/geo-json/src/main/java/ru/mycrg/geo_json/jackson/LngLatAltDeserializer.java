package ru.mycrg.geo_json.jackson;

import ru.mycrg.geo_json.LngLatAlt;
import tools.jackson.core.JsonParser;
import tools.jackson.core.JsonToken;
import tools.jackson.databind.DatabindException;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;

import java.util.ArrayList;
import java.util.List;

public class LngLatAltDeserializer extends ValueDeserializer<LngLatAlt> {

    private static final String TARGET_TYPE = LngLatAlt.class.getSimpleName();

    @Override
    public LngLatAlt deserialize(JsonParser jp, DeserializationContext ctxt) {
        if (!jp.isExpectedStartArrayToken()) {
            return (LngLatAlt) ctxt.handleUnexpectedToken(LngLatAlt.class, jp);
        }

        return deserializeArray(jp, ctxt);
    }

    protected LngLatAlt deserializeArray(JsonParser jp, DeserializationContext ctxt) {
        LngLatAlt node = new LngLatAlt();
        node.setLongitude(extractDouble(jp, ctxt, false));
        node.setLatitude(extractDouble(jp, ctxt, false));
        node.setAltitude(extractDouble(jp, ctxt, true));
        List<Double> additionalElementsList = new ArrayList<>();
        while (jp.hasCurrentToken() && jp.currentToken() != JsonToken.END_ARRAY) {
            double element = extractDouble(jp, ctxt, true);
            if (!Double.isNaN(element)) {
                additionalElementsList.add(element);
            }
        }

        double[] additionalElements = new double[additionalElementsList.size()];
        for (int i = 0; i < additionalElements.length; i++) {
            additionalElements[i] = additionalElementsList.get(i);
        }

        node.setAdditionalElements(additionalElements);

        return node;
    }

    private double extractDouble(JsonParser jp, DeserializationContext ctxt, boolean optional) {
        JsonToken token = jp.nextToken();
        if (token == null || token == JsonToken.END_ARRAY) {
            if (optional) {
                return Double.NaN;
            }

            throw DatabindException.from(ctxt, "Unexpected end-of-input when binding data into " + TARGET_TYPE);
        }

        if (token.isNumeric()) {
            return jp.getDoubleValue();
        }

        if (token == JsonToken.VALUE_STRING) {
            String value = jp.getString().trim();
            try {
                return Double.parseDouble(value);
            } catch (NumberFormatException e) {
                throw DatabindException.from(
                        ctxt,
                        "Unexpected token value (" + value + ") when binding data into " + TARGET_TYPE,
                        e
                );
            }
        }

        throw DatabindException.from(
                ctxt,
                "Unexpected token (" + token.name() + ") when binding data into " + TARGET_TYPE
        );
    }
}
