package ru.mycrg.integration_service.bpmn.gpkg.import_;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgImportReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExtractGpkgEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * Класс для импорта GPKG. (второй в цепочке)
 *
 * <h3>Репорт на этом этапе:</h3>
 * <ul>
 *   <li>Количество и состав таблиц которые внутри gpkg</li>
 *   <li>Есть описание сущности "Проект"</li>
 * </ul>
 */

@Service("askGeoWrapperExtractGpkg")
public class AskGeoWrapperExtractGpkg implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskGeoWrapperExtractGpkg.class);

    private final IMessageBusProducer messageBus;

    public AskGeoWrapperExtractGpkg(IMessageBusProducer messageBus) {

        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Ставим ивент распаковки geoPackage");
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

        GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(EVENT_IMPORT_GPKG_REPORT_NAME);
        log.debug("Отслеживание json импорт репорта: {}", importReport);

        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        messageBus.produce(new ExtractGpkgEvent(event.getDbName(), event.getFilePath(), businessKey));
    }
}
