package ru.mycrg.data_service.service.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.ExportRequestModel;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.FgisTpDocument;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ExportResponseEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.Map;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.service.export.ExportType.GML;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;
import static ru.mycrg.data_service_contract.enums.ProcessType.EXPORT;

@Service
public class GmlExportService implements Exporter {

    private final Logger log = LoggerFactory.getLogger(GmlExportService.class);

    private final TableService tableService;
    private final ISchemaService schemaService;
    private final ProcessService processService;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;
    private final Map<String, FgisTpDocument> fgisTpDocuments;

    public GmlExportService(TableService tableService,
                            @Qualifier("schemaServiceBase") ISchemaService schemaService,
                            ProcessService processService,
                            IMessageBusProducer messageBus,
                            IAuthenticationFacade authenticationFacade,
                            WsNotificationService wsNotificationService,
                            Map<String, FgisTpDocument> fgisTpDocuments) {
        this.messageBus = messageBus;
        this.tableService = tableService;
        this.schemaService = schemaService;
        this.processService = processService;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;
        this.fgisTpDocuments = fgisTpDocuments;
    }

    @Override
    public Process doExport(ExportRequestModel request) {
        long orgId = authenticationFacade.getOrganizationId();
        String dbName = getDefaultDatabaseName(orgId);
        String title = String.format("Экспорт. Кол-во слоев: %d", request.getResources().size());
        String fgisTpDocSchema = request.getDocSchema();

        Process process = processService.create(authenticationFacade.getLogin(), title, EXPORT, request);

        ExportProcessModel payload = new ExportProcessModel();
        payload.setFormat(request.getFormat());
        payload.setDocSchema(fgisTpDocSchema);
        payload.setEpsg(extractCrsNumber(request.getEpsg()));
        payload.setInvertedCoordinates(request.isInvertedCoordinates());

        FgisTpDocument fgisTpDocument = null;
        if (fgisTpDocuments.containsKey(fgisTpDocSchema)) {
            fgisTpDocument = fgisTpDocuments.get(fgisTpDocSchema);
        }

        if (fgisTpDocument == null) {
            throw new DataServiceException("Не настроено сопоставление со схемой: " + fgisTpDocSchema);
        }

        FgisTpDocument finalFgisTpDocument = fgisTpDocument;
        request.getResources().forEach(resourceModel -> {
            schemaService.getSchemaByName(resourceModel.getSchemaId()).ifPresent(schema -> {
                if (finalFgisTpDocument.getAll().contains(schema.getOriginName())) {
                    String objectCollection = "objectCollection";
                    if (finalFgisTpDocument.getSpecialZoneCollection().contains(schema.getOriginName())) {
                        objectCollection = "specialZoneCollection";
                    }

                    payload.addResource(
                            new ResourceProjection(dbName,
                                                   resourceModel.getDataset(),
                                                   resourceModel.getTable(),
                                                   schema,
                                                   tableService.getTableCrs(resourceModel.getTable()),
                                                   objectCollection));
                } else {
                    log.warn("Таблица: '{}' не входит в перечень документов по fgistp схеме: '{}'",
                             resourceModel.getTable(), fgisTpDocSchema);
                }
            });
        });

        ExportRequestEvent requestEvent = new ExportRequestEvent(process.getId(), dbName, payload);
        messageBus.produce(requestEvent);

        ExportResponseEvent responseEvent = new ExportResponseEvent(requestEvent, PENDING, title, 0);
        wsNotificationService.send(
                new WsMessageDto<>(EXPORT.name(), responseEvent), request.getWsUiId());

        return process;
    }

    @Override
    public ExportType getType() {
        return GML;
    }
}
