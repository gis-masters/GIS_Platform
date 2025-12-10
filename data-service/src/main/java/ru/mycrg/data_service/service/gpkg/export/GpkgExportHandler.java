package ru.mycrg.data_service.service.gpkg.export;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.export.ExportType;
import ru.mycrg.data_service.service.export.Exporter;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.dto.ExportRequestModel;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.ExportGpkgPayload;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import javax.validation.Valid;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.service.export.ExportType.GPKG;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
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
        ExportGpkgPayload exportGpkgPayload = getPayloadOrThrow(request);

        String title = "Экспорт " + request.getFormat();
        Process process = processService.create(authenticationFacade.getLogin(), title, EXPORT, request);

        long orgId = authenticationFacade.getOrganizationId();
        ExportGpkgEvent requestEvent = new ExportGpkgEvent(process.getId(),
                                                           getDefaultDatabaseName(orgId),
                                                           authenticationFacade.getAccessToken(),
                                                           exportGpkgPayload);
        messageBus.produce(requestEvent);

        return process;
    }

    @NotNull
    private ExportGpkgPayload getPayloadOrThrow(ExportRequestModel request) {
        String msg = "Не корректный формат данных для выполнения экспорта GPKG";

        ExportGpkgPayload exportGpkgPayload;
        try {
            exportGpkgPayload = mapper.convertValue(request.getPayload(), ExportGpkgPayload.class);
            if (exportGpkgPayload == null) {
                throw new BadRequestException(msg);
            }

            GpkgExportType gpkgExportType = exportGpkgPayload.getType();
            if (gpkgExportType == null) {
                String message = "Не поддерживаемый тип экспорта. Поддерживаемые форматы: PROJECT, LAYER, TABLE";

                throw new BadRequestException(msg, new ErrorInfo("type", message));
            }

            Object payload = exportGpkgPayload.getPayload();
            if (payload == null) {
                throw new BadRequestException(msg, new ErrorInfo("payload", "Тело должно быть заполнено"));
            }
        } catch (Exception e) {
            logError(msg, e);

            throw new BadRequestException(msg);
        }

        return exportGpkgPayload;
    }

    @Override
    public ExportType getType() {
        return GPKG;
    }
}
