package ru.mycrg.data_service.service.gpkg.export;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.ExportRequestModel;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.export.ExportType;
import ru.mycrg.data_service.service.export.Exporter;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import javax.validation.Valid;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.service.export.ExportType.GPKG;
import static ru.mycrg.data_service_contract.enums.ProcessType.EXPORT;

@Service
public class GpkgExportHandler implements Exporter {

    private final ProcessService processService;
    private final IAuthenticationFacade authenticationFacade;
    private final IMessageBusProducer messageBus;
    private final IMasterResourceProtector resourceProtector;

    public GpkgExportHandler(ProcessService processService,
                             IAuthenticationFacade authenticationFacade,
                             IMessageBusProducer messageBus,
                             @Qualifier("tableProtector") IMasterResourceProtector resourceProtector) {
        this.processService = processService;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
        this.resourceProtector = resourceProtector;
    }

    public Process doExport(@Valid ExportRequestModel request) {
        String dataset = request.getResources().get(0).getDataset();
        String table = request.getResources().get(0).getTable();

        if (!resourceProtector.isOwner(new ResourceQualifier(dataset, table))) {
            throw new BadRequestException("Экспорт в GPKG запрещён. Текущий пользователь не является владельцем " +
                                                  "указанного ресурса");
        }

        long orgId = authenticationFacade.getOrganizationId();
        String dbName = getDefaultDatabaseName(orgId);

        String title = request.getFormat();

        ExportProcessModel payload = new ExportProcessModel();
        payload.setFormat(request.getFormat());
        payload.addResource(new ResourceProjection(dbName, dataset, table));

        Process process = processService.create(authenticationFacade.getLogin(), title, EXPORT, request);
        ExportRequestEvent requestEvent = new ExportRequestEvent(process.getId(), dbName, payload);
        messageBus.produce(requestEvent);

        return process;
    }

    @Override
    public ExportType getType() {
        return GPKG;
    }
}
