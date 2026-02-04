package ru.mycrg.integration_service.bpmn.gpkg.export.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.BuildGpkgBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service
public class BuildGpkgBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(BuildGpkgBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public BuildGpkgBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return BuildGpkgBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        BuildGpkgBackwardEvent event = (BuildGpkgBackwardEvent) mqEvent;

        log.debug("Получен BuildGpkgResponseEvent от geo-wrapper для businessKey: {}, payload: {}",
                  event.getBusinessKey(), event.getPayload());

        if (event.getStatus() == DONE) {
            handleGpkgWrapperDoneEvent(event.getBusinessKey(), event.getPayload().toString(), "gpkgExist");
            log.debug("Успешно обработан ReverseGpkgExportEvent для businessKey: {}",
                      event.getBusinessKey());
        } else {
            log.debug("При экспорте gpkg geo-wrapper вернул ошибку: [{}]", event.getDescription());
            handleGpkgWrapperErrorEvent(event.getBusinessKey(),
                                        event.getPayload().toString(),
                                        event.getError());
        }
    }

    /**
     * Обрабатывает событие завершения обработки GPKG файла от geo-wrapper и отправляет сообщение в Camunda процесс.
     *
     * @param businessKey ключ бизнес-процесса
     * @param payload     путь к обработанному GPKG файлу, либо описание ошибки
     */
    public void handleGpkgWrapperDoneEvent(String businessKey, String payload, String status) {
        runtimeService.createMessageCorrelation("Mes_FromWrapperAboutGpkg")
                      .processInstanceBusinessKey(businessKey)
                      .setVariable(GPKG_PATH_VAR_NAME, payload)
                      .setVariable(CHECK_STATUS_VAR_NAME, status)
                      .correlateWithResult();
    }

    private void handleGpkgWrapperErrorEvent(String businessKey, String payload, String error) {
        runtimeService.createMessageCorrelation("Mes_FromWrapperAboutGpkg")
                      .processInstanceBusinessKey(businessKey)
                      .setVariable(GPKG_PATH_VAR_NAME, payload)
                      .setVariable(CHECK_STATUS_VAR_NAME, "gpkgNotExist")
                      .setVariable(FAIL_REASON, error)
                      .correlateWithResult();
    }
}
