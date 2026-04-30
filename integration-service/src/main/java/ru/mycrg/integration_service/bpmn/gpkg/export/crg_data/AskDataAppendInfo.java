package ru.mycrg.integration_service.bpmn.gpkg.export.crg_data;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.data_service_contract.queue.request.gpkg.AppendGpkgInfoEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.Collections;
import java.util.List;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("askDataAppendInfo")
public class AskDataAppendInfo implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskDataAppendInfo.class);

    private final IMessageBusProducer messageBus;

    public AskDataAppendInfo(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", AskDataAppendInfo.class.getSimpleName());

        String pathToGpkg = (String) delegateExecution.getVariable(EXPORT_GPKG_PATH_TO_GPKG);

        List<ExportResourceModel> resources;
        try {
            resources = (List<ExportResourceModel>) delegateExecution
                    .getVariable(EXPORT_GPKG_VECTOR_LIST);
        } catch (Exception e) {
            log.debug("Нет списка векторных таблицы, значит экспорт только растров.");
            resources = Collections.emptyList();
        }

        GpkgAppendingData appendingData = (GpkgAppendingData) delegateExecution
                .getVariable(EXPORT_GPKG_APPENDING_CRG_DATA);

        if (appendingData == null) {
            appendingData = new GpkgAppendingData();
        }
        appendingData.setResourceProjections(resources);

        String businessKey = delegateExecution.getProcessBusinessKey();
        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);

        log.debug("Запрос на добавление доп информации в gpkg был направлен.");

        messageBus.produce(new AppendGpkgInfoEvent(event.getDbName(), businessKey, pathToGpkg, appendingData));
    }
}
