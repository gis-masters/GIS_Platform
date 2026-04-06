package ru.mycrg.common_utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.script.*;
import java.util.HashMap;
import java.util.Map;

public class CrgScriptEngine {

    private final Logger log = LoggerFactory.getLogger(CrgScriptEngine.class);

    private final Compilable compilable;
    private final Invocable invocable;

    public CrgScriptEngine() {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        if (engine == null) {
            throw new IllegalStateException("JavaScript engine 'nashorn' is not available. " +
                                                    "Add org.openjdk.nashorn:nashorn-core to the runtime classpath.");
        }
        if (!(engine instanceof Compilable) || !(engine instanceof Invocable)) {
            throw new IllegalStateException("JavaScript engine 'nashorn' must implement both Compilable and Invocable.");
        }

        this.compilable = (Compilable) engine;
        this.invocable = (Invocable) engine;
    }

    /**
     * Вызов функции с обьектом в качестве параметра.
     *
     * @param data     Параметр для функции
     * @param function Функция
     *
     * @return Результат выполнения функции.
     */
    public Object invokeFunction(Map<String, Object> data, String function) {
        Object result = new HashMap<>();

        try {
            String statement = "function someFiz(obj) {" + function + "}";
            compilable.compile(statement).eval();

            result = invocable.invokeFunction("someFiz", data);
        } catch (ScriptException | NoSuchMethodException e) {
            log.error("Не удалось применить функцию: [{}], для объекта: [{}] => {}",
                      function, data, e.getLocalizedMessage());
        }

        if (result != null) {
            return result;
        } else {
            return new HashMap<>();
        }
    }

    public String invokeFunctionAsString(Map<String, Object> data, String function) {
        String result = "";

        try {
            String statement = "function someFiz(obj) {" + function + "}";
            compilable.compile(statement).eval();

            result = (String) invocable.invokeFunction("someFiz", data);
        } catch (ScriptException | NoSuchMethodException e) {
            log.error("Не удалось применить функцию как строку: [{}], для объекта: [{}] => {}",
                      function, data, e.getLocalizedMessage());
        }

        return result;
    }
}
