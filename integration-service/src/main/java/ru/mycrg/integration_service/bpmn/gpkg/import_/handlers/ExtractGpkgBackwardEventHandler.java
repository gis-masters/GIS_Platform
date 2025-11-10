package ru.mycrg.integration_service.bpmn.gpkg.import_.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.response.ExtractGpkgBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * Класс для импорта GPKG. (третий в цепочке)
 *
 * <h3>Репорт на этом этапе:</h3>
 * <ul>
 *   <li>Количество и состав таблиц которые внутри gpkg</li>
 *   <li>Есть описание сущности "Проект"</li>
 * </ul>
 */

@Service
public class ExtractGpkgBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ExtractGpkgBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public ExtractGpkgBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return ExtractGpkgBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ExtractGpkgBackwardEvent event = (ExtractGpkgBackwardEvent) mqEvent;
        ProcessStatus status = event.getStatus();
        String businessKey = event.getBusinessKey();

        log.debug("Получен ExtractGpkgBackwardEvent для businessKey: {}, status: {}",
                  businessKey, status);

        if (status == DONE) {
            runtimeService.createMessageCorrelation("Mes_FromWrapperAboutExtractGpkg")
                          .processInstanceBusinessKey(businessKey)
                          .setVariable(EXTRACTED_SCHEMA_NAME, event.getCreatedSchemaName())
                          .setVariable(FAIL_REASON, asJava(event.getErrorReport()))
                          .setVariable(CHECK_STATUS_VAR_NAME, "importDone")
                          .correlateWithResult();
        } else {
            runtimeService.createMessageCorrelation("Mes_FromWrapperAboutExtractGpkg")
                          .processInstanceBusinessKey(businessKey)
                          .setVariable(FAIL_REASON, asJava(event.getErrorDescription()))
                          .setVariable(CHECK_STATUS_VAR_NAME, "importFailed")
                          .correlateWithResult();
        }
    }
}
