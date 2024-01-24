package ru.mycrg.data_service.service.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.ValidationRequestDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.ValidationProcessModel;
import ru.mycrg.data_service_contract.queue.request.ValidationRequestEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service_contract.enums.ProcessType.VALIDATION;

@Service
public class ValidationService {

    private final ISchemaService schemaService;
    private final ProcessService processService;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;

    @Autowired
    public ValidationService(IMessageBusProducer messageBus,
                             @Qualifier("schemaServiceBase") ISchemaService schemaService,
                             IAuthenticationFacade authenticationFacade,
                             ProcessService processService) {
        this.messageBus = messageBus;
        this.schemaService = schemaService;
        this.processService = processService;
        this.authenticationFacade = authenticationFacade;
    }

    /**
     * Запустить процесс валидации.
     *
     * @param request Список ресурсов {@link ValidationRequestDto}
     */
    public Process validate(ValidationRequestDto request) {
        long orgId = authenticationFacade.getOrganizationId();
        final String dbName = getDefaultDatabaseName(orgId);
        final String title = String.format("Проверка %d слоёв(я) Организации: %s",
                                           request.getResources().size(), orgId);

        Process process = processService.create(authenticationFacade.getLogin(), title, VALIDATION, request);

        ValidationProcessModel payload = new ValidationProcessModel();

        request.getResources().forEach(resourceModel -> {
            schemaService.getSchemaByName(resourceModel.getSchemaId()).ifPresent(schema -> {
                payload.addResourceProjections(
                        new ResourceProjection(dbName,
                                               resourceModel.getDataset(),
                                               resourceModel.getTable(),
                                               schema));
            });
        });

        messageBus.produce(new ValidationRequestEvent(process.getId(), dbName, payload));

        return process;
    }
}
