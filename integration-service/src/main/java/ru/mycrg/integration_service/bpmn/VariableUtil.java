package ru.mycrg.integration_service.bpmn;

import org.camunda.bpm.engine.delegate.BaseDelegateExecution;

import java.text.MessageFormat;

public class VariableUtil {

    public static Object getVariable(BaseDelegateExecution execution, String varName, String scenarioName) {
        Object variable = execution.getVariable(varName);
        if (variable == null) {
            String msg = String.format(
                    "При выполнении сценария: '%s' не установлено значения для обязательной переменной: '%s'",
                    scenarioName, varName);

            throw new IllegalArgumentException(msg);
        }

        return variable;
    }
}
