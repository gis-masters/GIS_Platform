package ru.mycrg.data_service.service.gpkg.export;

import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.service.export.ExportType;
import ru.mycrg.data_service.service.export.Exporter;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.dto.ExportRequestModel;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
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

    public GpkgExportHandler(ProcessService processService,
                             IAuthenticationFacade authenticationFacade,
                             IMessageBusProducer messageBus) {
        this.processService = processService;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
    }

    public Process doExport(@Valid ExportRequestModel request) {
        String title = "Экспорт " + request.getFormat();
        Process process = processService.create(authenticationFacade.getLogin(), title, EXPORT, request);

        long orgId = authenticationFacade.getOrganizationId();
        ExportGpkgEvent requestEvent = new ExportGpkgEvent(process.getId(),
                                                           getDefaultDatabaseName(orgId),
                                                           authenticationFacade.getAccessToken(),
                                                           request);
        messageBus.produce(requestEvent);

        return process;
    }

    @Override
    public ExportType getType() {
        return GPKG;
    }
}
