package ru.mycrg.data_service.queue.handlers;

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
import ru.mycrg.data_service_contract.queue.request.PlaceShapeFileEvent;
import ru.mycrg.data_service_contract.queue.response.ShpPlacedSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.common_utils.CrgGlobalProperties.join;
import static ru.mycrg.data_service.service.processes.FileType.DXF;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Service
public class ShpPlacedSucceededEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ShpPlacedSucceededEventHandler.class);

    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    public ShpPlacedSucceededEventHandler(ProcessService processService,
                                          WsNotificationService wsNotificationService) {
        this.processService = processService;
        this.wsNotificationService = wsNotificationService;
    }

    @Override
    public String getEventType() {
        return ShpPlacedSucceededEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            ShpPlacedSucceededEvent event = (ShpPlacedSucceededEvent) mqEvent;
            PlaceShapeFileEvent requestEvent = event.getPlaceShapeFileEvent();

            ImportLayerReport layerReport = new ImportLayerReport(requestEvent.getFeatureName());
            layerReport.setSuccess(true);
            layerReport.setTableIdentifier(requestEvent.getFeatureName());

            List<ImportLayerReport> reports = new ArrayList<>();
            reports.add(layerReport);

            ImportReport importReport = new ImportReport();
            importReport.setSuccess(true);
            importReport.setProjectId(requestEvent.getProjectId());
            importReport.setImportLayerReports(reports);

            wsNotificationService.send(
                    new WsMessageDto<>(join(IMPORT.name(), DXF.name()),
                                       new WsImportModel(requestEvent.getWsMsgId(), DONE, importReport, "Успех")),
                    requestEvent.getWsUiId()
            );

            ProcessModel processModel = requestEvent.getProcessModel();
            processService.complete(processModel.getDbName(), processModel.getId(), toJsonNode(requestEvent));

            log.debug("Процесс успешно завершен");
        } catch (Exception e) {
            log.error("Не удалось корректно обработать ShpPlacedSucceededEventHandler. Причина: {}", e.getMessage());
        }
    }
}
