package ru.mycrg.data_service.service.gpkg.export;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.export.ExportType;
import ru.mycrg.data_service.service.export.Exporter;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service_contract.dto.*;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import javax.validation.Valid;
import java.util.LinkedList;
import java.util.List;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.service.export.ExportType.GPKG;
import static ru.mycrg.data_service_contract.enums.ProcessType.EXPORT;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

@Service
public class GpkgExportHandler implements Exporter {

    private static final Logger log = LoggerFactory.getLogger(GpkgExportHandler.class);

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
        String title = request.getFormat() + " (" + request.getResources().size() + " табл.)";
        Process process = processService.create(authenticationFacade.getLogin(), title, EXPORT, request);

        List<ExportResourceModel> availableResources = new LinkedList<>();
        List<ExportResourceModel> tablesWithoutAccess = new LinkedList<>();
        List<ExportResourceModel> notFoundedResources = new LinkedList<>();
        List<ExportDetails> exportDetails = new LinkedList<>();

        // Проверяем доступ к каждому ресурсу
        for (ExportResourceModel resource: request.getResources()) {
            try {
                ResourceQualifier currentObject = new ResourceQualifier(resource.getDataset(), resource.getTable());
                resourceProtector.throwIfNotExist(currentObject);

                if (!resourceProtector.isOwner(currentObject)) {
                    log.debug("Пользователь не является владельцем ресурса {}", resource);
                    tablesWithoutAccess.add(resource);
                } else {
                    availableResources.add(resource);
                }
            } catch (NotFoundException e) {
                log.debug("Невозможно экспортировать несуществующий ресурс: {}", resource);
                notFoundedResources.add(resource);
            }
        }

        if (!tablesWithoutAccess.isEmpty()) {
            exportDetails.add(
                    new ExportDetails("Ресурсы не могут быть экспортированы, текущий пользователь не является " +
                                              "владельцем указанных ресурсов!!!", tablesWithoutAccess));
        }

        if (!notFoundedResources.isEmpty()) {
            exportDetails.add(new ExportDetails("Пользователь указал несуществующие ресурсы!!!",
                                                notFoundedResources));
        }

        if (!exportDetails.isEmpty()) {
            ExportRequestModel exportRequestModel = extractExportRequestModel(process.getExtra());
            exportRequestModel.setExportDetails(exportDetails);

            process.setExtra(toJsonNode(exportRequestModel));

            processService.save(process);
        }

        long orgId = authenticationFacade.getOrganizationId();
        String dbName = getDefaultDatabaseName(orgId);
        if (availableResources.isEmpty()) {
            log.debug("Останавливаем экспорт. Пользователь не является владельцем хотя бы одного ресурса!!!");
            processService.error(dbName, process);

            throw new BadRequestException("Экспорт в GPKG запрещён. Текущий пользователь не является владельцем " +
                                                  "указанных в запросе ресурсов!!!");
        }

        ExportProcessModel payload = new ExportProcessModel();
        payload.setFormat(request.getFormat());

        // Добавляем только доступные ресурсы в payload
        for (ExportResourceModel resource: availableResources) {
            payload.addResource(new ResourceProjection(dbName, resource.getDataset(), resource.getTable()));
        }

        ExportRequestEvent requestEvent = new ExportRequestEvent(process.getId(), dbName, payload);
        messageBus.produce(requestEvent);

        return process;
    }

    @Override
    public ExportType getType() {
        return GPKG;
    }

    public static ExportRequestModel extractExportRequestModel(JsonNode extra) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.treeToValue(extra, ExportRequestModel.class);
        } catch (Exception e) {
            throw new IllegalStateException("Ошибка парсинга ExportRequestModel: " + e.getMessage());
        }
    }
}
