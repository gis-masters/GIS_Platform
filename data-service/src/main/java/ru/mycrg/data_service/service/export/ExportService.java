package ru.mycrg.data_service.service.export;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.ExportRequestModel;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.service.ProcessService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.data_service_contract.enums.ProcessType.EXPORT;

@Service
public class ExportService {

    private final SchemaService schemaService;
    private final ProcessService processService;
    private final IMessageBusProducer messageBus;

    public ExportService(IMessageBusProducer messageBus,
                         SchemaService schemaService,
                         ProcessService processService) {
        this.messageBus = messageBus;
        this.schemaService = schemaService;
        this.processService = processService;
    }

    public Process export(ExportRequestModel request, Authentication authentication) {
        long orgId = getOrganizationId(authentication);
        final String dbName = getDefaultDatabaseName(orgId);
        final String title = String.format("Экспорт. Кол-во слоев: %d", request.getResources().size());

        Process process = processService.create(authentication.getName(), title, EXPORT, request);

        ExportProcessModel payload = new ExportProcessModel();
        payload.setFormat(request.getFormat());
        payload.setDocSchema(request.getDocSchema());

        request.getResources().forEach(resourceModel -> {
            schemaService.getSchemaByName(resourceModel.getSchemaId()).ifPresent(schema -> {
                payload.addResource(
                        new ResourceProjection(dbName,
                                               resourceModel.getDataset(),
                                               resourceModel.getTable(),
                                               schema));
            });
        });

        messageBus.produce(
                new ExportRequestEvent(process.getId(), dbName, payload));

        return process;
    }
}
