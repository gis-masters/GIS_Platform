package ru.mycrg.data_service.service.schemas;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.common_utils.ScriptCalculator;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.data_service.service.schemas.SchemaUtil.getPropertiesWithCalculatedFunctions;

@Service
public class CustomRuleCalculator {

    private final Logger log = LoggerFactory.getLogger(CustomRuleCalculator.class);

    private final CrgScriptEngine scriptEngine;
    private final ScriptCalculator scriptCalculator;

    public CustomRuleCalculator(CrgScriptEngine scriptEngine,
                                ScriptCalculator scriptCalculator) {
        this.scriptEngine = scriptEngine;
        this.scriptCalculator = scriptCalculator;
    }

    public Map<String, Object> calculate(SchemaDto schema, Map<String, Object> initialProps) {
        Map<String, Object> result = new HashMap<>();

        String calcFiledFunction = schema.getCalcFiledFunction();
        if (calcFiledFunction != null) {
            ((Map<String, Object>) scriptEngine.invokeFunction(initialProps, calcFiledFunction))
                    .forEach((key, value) -> {
                        log.debug("Add prop: {}, with: {}", key, value);

                        result.put(key, value);
                    });
        }

        Map<String, String> propsWithFunctions = getPropertiesWithCalculatedFunctions(schema);
        propsWithFunctions.forEach((key, value) -> {
            String formula = propsWithFunctions.get(key);
            result.putAll(scriptCalculator.calculate(initialProps, key, formula));

            log.debug("Add prop: {} = {}, calculated by: {}", key, value, formula);
        });

        return result;
    }
}
