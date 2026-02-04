package ru.mycrg.integration_service.bpmn.gpkg.export.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.response.AppendGpkgInfoBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.CHECK_STATUS_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.FAIL_REASON;

@Service
public class AppendGpkgInfoBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(AppendGpkgInfoBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public AppendGpkgInfoBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return AppendGpkgInfoBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        AppendGpkgInfoBackwardEvent event = (AppendGpkgInfoBackwardEvent) mqEvent;
        ProcessStatus status = event.getStatus();

        log.debug("Получен AppendGpkgBackwardEvent для businessKey: {}, status: {}",
                  event.getBusinessKey(), status);

        if (status == DONE) {
            runtimeService.createMessageCorrelation("Mes_FromDataAppendingInfo")
                          .processInstanceBusinessKey(event.getBusinessKey())
                          .setVariable(CHECK_STATUS_VAR_NAME, "sunIsShining")
                          .correlateWithResult();

            log.debug("Успешно отправлено сообщение в Camunda процесс для businessKey: {}",
                      event.getBusinessKey());
        } else {
            runtimeService.createMessageCorrelation("Mes_FromDataAppendingInfo")
                          .processInstanceBusinessKey(event.getBusinessKey())
                          .setVariable(CHECK_STATUS_VAR_NAME, "fail")
                          .setVariable(FAIL_REASON, event.getErrorMsg())
                          .correlateWithResult();
        }
    }
}
