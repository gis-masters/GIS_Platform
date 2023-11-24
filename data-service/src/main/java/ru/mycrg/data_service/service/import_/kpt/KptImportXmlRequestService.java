package ru.mycrg.data_service.service.import_.kpt;

import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.kpt_import.KptImportXmlRequest;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.queue.request.KptImportXmlRequestEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;

/**
 * Сервис обработки задач на импорт КПТ из XML
 */
@Service
public class KptImportXmlRequestService {

    private final IMessageBusProducer messageBus;
    private final SchemaService schemaService;
    private final IAuthenticationFacade authenticationFacade;
    private final KptSourceFilesService kptSourceFilesService;

    public KptImportXmlRequestService(IMessageBusProducer messageBus,
                                      SchemaService schemaService,
                                      IAuthenticationFacade authenticationFacade,
                                      KptSourceFilesService kptSourceFilesService) {
        this.messageBus = messageBus;
        this.schemaService = schemaService;
        this.authenticationFacade = authenticationFacade;
        this.kptSourceFilesService = kptSourceFilesService;
    }

    /**
     * Создает задачу импорта и отправляет в очередь событие на запуск импорта
     *
     * @param request запрос на импорт
     *
     * @return task импорта
     */
    public IRecord initImport(KptImportXmlRequest request) {
        KptImportXmlRequestEvent event = new KptImportXmlRequestEvent(
                kptSourceFilesService.getSourceFiles(request.getFileId()),
                getDatabaseName(),
                findSchemas(request.getLayersSchemasNames()),
                authenticationFacade.getAccessToken(),
                authenticationFacade.getLogin(),
                request.getProjectId()
        );
        messageBus.produce(event);

        return null;//todo return task
    }

    private String getDatabaseName() {
        Long orgId = authenticationFacade.getOrganizationId();
        return getDefaultDatabaseName(orgId);
    }

    private List<SchemaDto> findSchemas(List<String> names) {
        List<SchemaDto> schemas = schemaService.getSchemas(names);
        if (schemas.size() != names.size()) {
            List<String> foundNames = schemas.stream().map(SchemaDto::getName).collect(Collectors.toList());
            String notFoundNames = names.stream()
                                        .filter(name -> !foundNames.contains(name))
                                        .collect(Collectors.joining(","));
            throw new DataServiceException("Не найдены схемы для импорта: " + notFoundNames);
        }
        return schemas;
    }
}
