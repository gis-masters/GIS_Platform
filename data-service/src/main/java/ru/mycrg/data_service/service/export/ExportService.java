package ru.mycrg.data_service.service.export;

import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.ExportRequestModel;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ExportResponseEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;
import static ru.mycrg.data_service_contract.enums.ProcessType.EXPORT;

@Service
public class ExportService {

    private final SchemaService schemaService;
    private final ProcessService processService;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;
    private final TableService tableService;

    public ExportService(IMessageBusProducer messageBus,
                         SchemaService schemaService,
                         IAuthenticationFacade authenticationFacade,
                         ProcessService processService,
                         WsNotificationService wsNotificationService,
                         TableService tableService) {
        this.messageBus = messageBus;
        this.schemaService = schemaService;
        this.processService = processService;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;
        this.tableService = tableService;
    }

    public Process export(ExportRequestModel request) {
        long orgId = authenticationFacade.getOrganizationId();
        final String dbName = getDefaultDatabaseName(orgId);
        final String title = String.format("Экспорт. Кол-во слоев: %d", request.getResources().size());

        Process process = processService.create(authenticationFacade.getLogin(), title, EXPORT, request);

        ExportProcessModel payload = new ExportProcessModel();
        payload.setFormat(request.getFormat());
        payload.setDocSchema(request.getDocSchema());

        request.getResources().forEach(resourceModel -> {
            schemaService.getSchemaByName(resourceModel.getSchemaId()).ifPresent(schema -> {
                String tableCrs = tableService.getTableCrs(resourceModel.getTable());
                payload.addResource(
                        new ResourceProjection(dbName,
                                               resourceModel.getDataset(),
                                               resourceModel.getTable(),
                                               schema,
                                               tableCrs));
            });
        });

        final ExportRequestEvent requestEvent = new ExportRequestEvent(process.getId(), dbName, payload);
        messageBus.produce(requestEvent);

        final ExportResponseEvent responseEvent = new ExportResponseEvent(requestEvent, PENDING, title, 0);
        wsNotificationService.send(
                new WsMessageDto<>(EXPORT.name(), responseEvent), request.getWsUiId());

        return process;
    }
}
