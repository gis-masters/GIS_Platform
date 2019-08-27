package ru.mycrg.wrapper.service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.script.*;
import java.util.HashMap;
import java.util.Map;

@Service
public class CrgScriptEngine {

    private static final Logger log = LoggerFactory.getLogger(CrgScriptEngine.class);

    private final ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
    private final Compilable compilable = (Compilable) engine;
    private final Invocable invocable = (Invocable) engine;

    /**
     * Вызов функции с обьектом в качестве параметра.
     *
     * @param data Параметр для функции
     * @param function Функция
     * @return Результат выполнения функции.
     */
    public Map<String, String> invokeFunction(Map<String, Object> data, String function) {
        Map<String, String> result = new HashMap<>();
        try {
            String statement = "function someFiz(obj) {" + function + "}";
            compilable.compile(statement).eval();

            result = (Map<String, String>) invocable.invokeFunction("someFiz", data);
        } catch (ScriptException | NoSuchMethodException e) {
            log.error("Ошибка при анализе доп. правил, {} ", e.getLocalizedMessage());
        }

        if (result != null) {
            return result;
        } else {
            return new HashMap<>();
        }
    }

}
