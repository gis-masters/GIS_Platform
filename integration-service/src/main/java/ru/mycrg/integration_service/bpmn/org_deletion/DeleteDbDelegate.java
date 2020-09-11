package ru.mycrg.integration_service.bpmn.org_deletion;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DeleteDbDelegate implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(DeleteDbDelegate.class);

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.info("DeleteDbDelegate");
    }
}
