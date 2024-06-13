package ru.mycrg.integration_service.bpmn.org_creation;

import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;

import static java.lang.Thread.sleep;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service("checkResultsDelegate")
public class CheckResultsDelegate implements JavaDelegate {

    public static final int REPEAT_LIMIT = 4;
    public static final long WAIT_INTERVAL = 15_000L;

    private final Logger log = LoggerFactory.getLogger(CheckResultsDelegate.class);

    private final HistoryService historyService;

    public CheckResultsDelegate(HistoryService historyService) {
        this.historyService = historyService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String processId = (String) execution.getVariable(PROCESS_ID_VAR_NAME);
        int currentIteration = (int) getVariable(execution, ITERATION_COUNTER_VAR_NAME, getClass().getName());

        if (currentIteration > REPEAT_LIMIT || processId == null) {
            execution.setVariable(CHECK_STATUS_VAR_NAME, "FAILED");
        } else {
            log.debug("CheckResultsDelegate: {}, currentIteration: {}", processId, currentIteration);

            sleep(WAIT_INTERVAL * currentIteration);

            var processInstance = historyService.createHistoricProcessInstanceQuery()
                                                .processInstanceId(processId)
                                                .singleResult();
            if (processInstance != null) {
                log.debug("process: '{}' in state: '{}'", processId, processInstance.getState());
                if ("COMPLETED".equals(processInstance.getState())) {
                    OrganizationInitializedEvent event = objectMapper.readValue(
                            (String) getVariable(execution, EVENT_VAR_NAME, getClass().getName()),
                            OrganizationInitializedEvent.class);

                    if (event.getSpecializationId() != null) {
                        execution.setVariable(CHECK_STATUS_VAR_NAME, "SUCCESS_WITH_SPECIALIZATION");
                    } else {
                        execution.setVariable(CHECK_STATUS_VAR_NAME, "SUCCESS");
                    }
                } else {
                    execution.setVariable(CHECK_STATUS_VAR_NAME, "REPEAT");
                    execution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);
                }
            } else {
                log.error("Failed get camunda process by id: {}", processId);

                execution.setVariable(CHECK_STATUS_VAR_NAME, "FAILED");
            }
        }
    }
}
