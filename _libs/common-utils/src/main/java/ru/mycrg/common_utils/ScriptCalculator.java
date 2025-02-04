package ru.mycrg.common_utils;

import java.util.HashMap;
import java.util.Map;

public class ScriptCalculator {

    private final CrgScriptEngine scriptEngine;

    public ScriptCalculator(CrgScriptEngine scriptEngine) {
        this.scriptEngine = scriptEngine;
    }

    public Map<String, Object> calculate(Map<String, Object> dataAsRow,
                                         String fieldName,
                                         String function) {
        Map<String, Object> resultProps = new HashMap<>();
        if (dataAsRow.containsKey(fieldName)) {
            String result = scriptEngine.invokeFunctionAsString(dataAsRow, function);
            resultProps.put(fieldName, result);
        }

        return resultProps;
    }
}
