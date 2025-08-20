package ru.mycrg.data_service.service.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.ExportResourceModel;
import ru.mycrg.data_service.dto.ValidationRequestDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.ValidationProcessModel;
import ru.mycrg.data_service_contract.queue.request.ValidationRequestEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service_contract.enums.ProcessType.VALIDATION;

@Service
public class ValidationService {

    private final ProcessService processService;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    @Autowired
    public ValidationService(IMessageBusProducer messageBus,
                             IAuthenticationFacade authenticationFacade,
                             ProcessService processService,
                             SchemasAndTablesRepository schemasAndTablesRepository) {
        this.messageBus = messageBus;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
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
                               payload.addResourceProjections(
                                       new ResourceProjection(dbName,
                                                              exportResourceModel.getDataset(),
                                                              table.getIdentifier(),
                                                              jsonToDto(table.getSchema())));
                           });
                });

        messageBus.produce(new ValidationRequestEvent(process.getId(), dbName, payload));

        return process;
    }
}
