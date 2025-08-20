package ru.mycrg.common_utils;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CrgScriptEngineTest {

    @Test
    void calculatedFields() {
        CrgScriptEngine crgScriptEngine = new CrgScriptEngine();
        Map<String, Object> object = new HashMap<>();
        object.put("title", "object");
        object.put("name", "random");
        object.put("year", "2022");
        String function = " return obj.title + '-' + obj.name + '-' + obj.year;";

        String result = crgScriptEngine.invokeFunctionAsString(object, function);

        assertEquals("object-random-2022", result);
    }

    @Test
    void calculatedFieldsWithNullFields() {
        CrgScriptEngine crgScriptEngine = new CrgScriptEngine();
        Map<String, Object> object = new HashMap<>();
        object.put("title", null);
        object.put("name", "random");
        object.put("year", "2022");
        String function = " return obj.title + '-' + obj.name + '-' + obj.year;";

        String result = crgScriptEngine.invokeFunctionAsString(object, function);

        assertEquals("null-random-2022", result);
    }
}
