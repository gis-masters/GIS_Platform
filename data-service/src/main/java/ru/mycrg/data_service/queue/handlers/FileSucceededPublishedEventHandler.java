package ru.mycrg.data_service.queue.handlers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.import_.model.WsImportModel;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.dto.ImportLayerReport;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.dto.publication.BaseWsProcess;
import ru.mycrg.data_service_contract.dto.publication.GisPublicationData;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.data_service_contract.queue.response.FileSucceededPublishedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.common_utils.CrgGlobalProperties.join;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Service
public class FileSucceededPublishedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(FileSucceededPublishedEventHandler.class);

    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    public FileSucceededPublishedEventHandler(ProcessService processService,
                                              WsNotificationService wsNotificationService) {
        this.processService = processService;
        this.wsNotificationService = wsNotificationService;
    }

    @Override
    public String getEventType() {
        return FileSucceededPublishedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            FileSucceededPublishedEvent event = (FileSucceededPublishedEvent) mqEvent;
            FilePublicationEvent initialEvent = event.getFilePublicationEvent();
            FileType type = initialEvent.getType();
            BaseWsProcess baseProcessData = initialEvent.getBaseWsProcess();

            wsNotificationService.send(
                    new WsMessageDto<>(
                            join(IMPORT.name(), type.name()),
                            new WsImportModel(baseProcessData.getWsMsgId(), DONE, getReport(initialEvent), "Успех")),
                    baseProcessData.getWsUiId()
            );

            ProcessModel processModel = baseProcessData.getProcessModel();
            processService.complete(processModel.getDbName(), processModel.getId(), toJsonNode(initialEvent));

            log.debug("Процесс публикации файла: '{}' успешно завершен", type);
        } catch (Exception e) {
            logError("Не удалось корректно обработать FileSucceededPublishedEvent", e);
        }
    }

    @NotNull
    private static ImportReport getReport(FilePublicationEvent requestEvent) {
        String featureTypeName = requestEvent.getGeoserverPublicationData().getFeatureTypeName();
        GisPublicationData gisPublicationData = requestEvent.getGisPublicationData();

        ImportLayerReport layerReport = new ImportLayerReport(featureTypeName);
        layerReport.setSuccess(true);
        layerReport.setTableIdentifier(featureTypeName);

        List<ImportLayerReport> reports = new ArrayList<>();
        reports.add(layerReport);

        ImportReport importReport = new ImportReport();
        importReport.setSuccess(true);
        importReport.setProjectId(gisPublicationData.getProjectId());
        importReport.setImportLayerReports(reports);

        return importReport;
    }
}
