package ru.mycrg.integration_service.bpmn.org_deletion;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Random;

public class CheckResultDelegate implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CheckResultDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final boolean result = new Random().nextBoolean();

        log.info("result: {}", result);

        execution.setVariable("isDeleted", result);
    }
}
