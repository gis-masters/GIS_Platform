package ru.mycrg.integration_service.bpmn.gpkg.export.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.response.AppendGpkgFileBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.CHECK_STATUS_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.FAIL_REASON;

/**
 * Обработчик AppendGpkgBackwardEvent от data-service в рамках BPMN экспорта GPKG.
 *
 * <p>Получает сообщение от data-service и коррелирует его с Camunda процессом.</p>
 *
 * <h3>Текущее поведение:</h3>
 * <ul>
 *   <li>Получает AppendGpkgBackwardEvent через MessageBusConsumer</li>
 *   <li>Извлекает businessKey.</li>
 *   <li>Отправляет сообщение в Camunda процесс через корреляцию</li>
 *   <li>В зависимости от получаемого статуса ивента переходим на разные ветки.</li>
 * </ul>
 */

@Service
public class AppendGpkgFileBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(AppendGpkgFileBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public AppendGpkgFileBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return AppendGpkgFileBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        AppendGpkgFileBackwardEvent event = (AppendGpkgFileBackwardEvent) mqEvent;
        ProcessStatus status = event.getStatus();

        log.debug("Получен AppendGpkgFileBackwardEvent для businessKey: {}, status: {}",
                  event.getBusinessKey(), event.getStatus());

        if (status == DONE) {
            runtimeService.createMessageCorrelation("Mes_FromDataAppendingFiles")
                          .processInstanceBusinessKey(event.getBusinessKey())
                          .setVariable(CHECK_STATUS_VAR_NAME, "sunIsShining")
                          .correlateWithResult();
        } else {
            runtimeService.createMessageCorrelation("Mes_FromDataAppendingFiles")
                          .processInstanceBusinessKey(event.getBusinessKey())
                          .setVariable(CHECK_STATUS_VAR_NAME, "fail")
                          .setVariable(FAIL_REASON, event.getErrorMsg())
                          .correlateWithResult();
        }
    }
}
