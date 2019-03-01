package ru.mycrg.wrapper.service.validation.constraints;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.EntityTypeDto;

import javax.script.*;
import java.util.HashMap;
import java.util.Map;

public class CustomRuleValidation {

    private static final Logger log = LoggerFactory.getLogger(CustomRuleValidation.class);

    public CustomRuleValidation() {}

    public Map<String, String> validate(EntityTypeDto entityType, Map<String, Object> data) {
        final ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        final Compilable compilable = (Compilable) engine;
        final Invocable invocable = (Invocable) engine;

        Map<String, String> result = new HashMap<>();
        try {
            String statement = "function validate(obj) {" + entityType.getCustomRuleFunction() + "}";
            compilable.compile(statement).eval();

            result = (Map<String, String>) invocable.invokeFunction("validate", data);
            return result;
        } catch (ScriptException | NoSuchMethodException e) {
            log.error("Ошибка при анализе доп. правил, {} ", e.getLocalizedMessage());
        }

        return result;
    }
}
