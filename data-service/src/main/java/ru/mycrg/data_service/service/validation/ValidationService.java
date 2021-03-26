package ru.mycrg.data_service.service.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.ValidationRequestDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.service.ProcessService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.ValidationProcessModel;
import ru.mycrg.data_service_contract.queue.request.ValidationRequestEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.security.Principal;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.data_service_contract.enums.ProcessType.VALIDATION;

@Service
public class ValidationService {

    private final SchemaService schemaService;
    private final ProcessService processService;
    private final IMessageBusProducer messageBus;

    @Autowired
    public ValidationService(IMessageBusProducer messageBus,
                             SchemaService schemaService,
                             ProcessService processService) {
        this.messageBus = messageBus;
        this.schemaService = schemaService;
        this.processService = processService;
    }

    /**
     * Запустить процесс валидации.
     *
     * @param principal Пользователь
     * @param request   Список ресурсов {@link ValidationRequestDto}
     */
    public Process validate(ValidationRequestDto request, Principal principal) {
        long orgId = getOrganizationId(principal);
        final String dbName = getDefaultDatabaseName(orgId);
        final String title = String.format("Валидация %d слоёв(я) Организации: %s",
                                           request.getResources().size(), orgId);

        Process process = processService.create(principal.getName(), title, VALIDATION, request);

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
