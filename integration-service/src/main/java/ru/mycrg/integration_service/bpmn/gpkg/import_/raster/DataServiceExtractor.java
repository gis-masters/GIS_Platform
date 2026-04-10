package ru.mycrg.integration_service.bpmn.gpkg.import_.raster;

import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service("dataServiceExtractor")
public class DataServiceExtractor implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(DataServiceExtractor.class);

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Этот шаг не реализован!");

        throw new BpmnError("unrealizedFunctionality");
    }
}
