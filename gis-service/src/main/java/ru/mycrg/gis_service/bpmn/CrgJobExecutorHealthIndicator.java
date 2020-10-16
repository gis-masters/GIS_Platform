package ru.mycrg.gis_service.bpmn;

import org.camunda.bpm.engine.impl.jobexecutor.JobExecutor;
import org.camunda.bpm.spring.boot.starter.actuator.JobExecutorHealthIndicator;
import org.springframework.boot.actuate.health.Health;
import org.springframework.stereotype.Service;

@Service
public class CrgJobExecutorHealthIndicator extends JobExecutorHealthIndicator {

    public CrgJobExecutorHealthIndicator(JobExecutor jobExecutor) {
        super(jobExecutor);
    }

    @Override
    protected void doHealthCheck(Health.Builder builder) {
        builder.up().build();
    }
}
