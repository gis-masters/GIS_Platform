package ru.mycrg.data_service.service.export;

import org.springframework.stereotype.Service;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.ExportRequestModel;
import ru.mycrg.data_service.dto.ExportResourceModel;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ExportResponseEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service.service.export.ExportType.SHAPE;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;
import static ru.mycrg.data_service_contract.enums.ProcessType.EXPORT;

// TODO: в будущем вернуться к врапперу. пока как есть
@Service
public class ShapeExportService implements Exporter {

    private final ProcessService processService;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public ShapeExportService(ProcessService processService,
                              IMessageBusProducer messageBus,
                              IAuthenticationFacade authenticationFacade,
                              WsNotificationService wsNotificationService,
                              SchemasAndTablesRepository schemasAndTablesRepository) {
        this.processService = processService;
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    @Override
    public Process doExport(ExportRequestModel request) {
        long orgId = authenticationFacade.getOrganizationId();
        String dbName = getDefaultDatabaseName(orgId);
        String title = String.format("Экспорт. Кол-во слоев: %d", request.getResources().size());

        Process process = processService.create(authenticationFacade.getLogin(), title, EXPORT, request);

        ExportProcessModel payload = new ExportProcessModel();
        payload.setFormat(request.getFormat());
        payload.setDocSchema(request.getDocSchema());
        payload.setEpsg(extractCrsNumber(request.getEpsg()));
        payload.setInvertedCoordinates(request.isInvertedCoordinates());

        List<String> tableIdentifiers = request.getResources()
                                               .stream()
                                               .map(ExportResourceModel::getTable)
                                               .collect(Collectors.toList());
        schemasAndTablesRepository
                .findByIdentifierIn(tableIdentifiers)
                .forEach(table -> {
                    request.getResources().stream()
                           .filter(item -> Objects.equals(item.getTable(), table.getIdentifier()))
                           .findFirst()
                           .ifPresent(exportResourceModel -> {
                               payload.addResource(
                                       new ResourceProjection(dbName,
                                                              exportResourceModel.getDataset(),
                                                              table.getIdentifier(),
                                                              jsonToDto(table.getSchema()),
                                                              table.getCrs()));
                           });
                });

        ExportRequestEvent requestEvent = new ExportRequestEvent(process.getId(), dbName, payload);
        messageBus.produce(requestEvent);

        ExportResponseEvent responseEvent = new ExportResponseEvent(requestEvent, PENDING, title, 0);
        wsNotificationService.send(
                new WsMessageDto<>(EXPORT.name(), responseEvent), request.getWsUiId());

        String resources = payload.getResourceProjections().stream()
                                  .map(res -> res.getSchemaName() + "." + res.getTableName())
                                  .collect(Collectors.joining(","));

        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  EXPORT.name(),
                                  resources,
                                  TABLE.name(),
                                  -1L));

        return process;
    }

    @Override
    public ExportType getType() {
        return SHAPE;
    }
}
