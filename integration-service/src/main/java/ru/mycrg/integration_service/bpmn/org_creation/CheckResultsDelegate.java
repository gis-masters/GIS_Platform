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

@Service("checkResultsDelegate")
public class CheckResultsDelegate implements JavaDelegate {

    public static final int REPEAT_LIMIT = 4;
    public static final long WAIT_INTERVAL = 5_000L;

    private final Logger log = LoggerFactory.getLogger(CheckResultsDelegate.class);

    private final HistoryService historyService;

    public CheckResultsDelegate(HistoryService historyService) {
        this.historyService = historyService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String processId = (String) execution.getVariable(PROCESS_ID_VAR_NAME);
        int currentCounter = (int) execution.getVariable(COUNTER_VAR_NAME);
        if (currentCounter > REPEAT_LIMIT || processId == null) {
            execution.setVariable(CHECK_STATUS_VAR_NAME, "FAILED");
        } else {
            log.debug("CheckResultsDelegate: {}, currentCounter: {}", processId, currentCounter);

            sleep(WAIT_INTERVAL * currentCounter);

            var processInstance = historyService.createHistoricProcessInstanceQuery()
                                                .processInstanceId(processId)
                                                .singleResult();
            if (processInstance != null) {
                log.debug("process: '{}' in state: '{}'", processId, processInstance.getState());
                if ("COMPLETED".equals(processInstance.getState())) {
                    execution.setVariable(CHECK_STATUS_VAR_NAME, "SUCCESS");
                } else {
                    execution.setVariable(CHECK_STATUS_VAR_NAME, "REPEAT");
                    execution.setVariable(COUNTER_VAR_NAME, currentCounter + 1);
                }
            } else {
                log.error("Failed get camunda process by id: {}", processId);

                final Object jsonString = execution.getVariable(EVENT_VAR_NAME);
                var event = objectMapper.readValue((String) jsonString, OrganizationInitializedEvent.class);

                execution.setVariable(CHECK_STATUS_VAR_NAME, "FAILED");
                execution.setVariable(ORG_ID_VAR_NAME, event.getOrgId());
            }
        }
    }
}
