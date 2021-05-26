package ru.mycrg.integration_service.bpmn;

import org.camunda.bpm.engine.variable.Variables;
import org.camunda.bpm.engine.variable.value.ObjectValue;

public class CamundaVariables {

    private CamundaVariables() {
        throw new IllegalStateException("Utility class");
    }

    public static ObjectValue asJava(Object object) {
        return Variables.objectValue(object)
                        .serializationDataFormat(Variables.SerializationDataFormats.JAVA)
                        .create();
    }
}
