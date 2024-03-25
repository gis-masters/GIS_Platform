package ru.mycrg.data_service.service.cqrs.tables.handlers;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.cqrs.tables.requests.UpdateTableSchemaRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;

@Component
public class UpdateTableSchemaRequestHandler implements IRequestHandler<UpdateTableSchemaRequest, Voidy> {

    private final IMasterResourceProtector resourceProtector;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public UpdateTableSchemaRequestHandler(MasterResourceProtector resourceProtector,
                                           SchemasAndTablesRepository schemasAndTablesRepository) {
        this.resourceProtector = resourceProtector;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    @Override
    @Transactional
    public Voidy handle(UpdateTableSchemaRequest request) {
        ResourceQualifier qualifier = request.getQualifier();
        SchemaDto newSchema = request.getSchema();

        if (!resourceProtector.isEditAllowed(qualifier)) {
            throw new ForbiddenException(
                    "Недостаточно прав для редактирования схемы слоя: " + qualifier.getQualifier());
        }

        SchemasAndTables tableForUpdate = schemasAndTablesRepository
                .findByIdentifier(qualifier.getTable())
                .orElseThrow(() -> new NotFoundException("Не найдена таблица: " + qualifier.getTable()));

        tableForUpdate.setLastModified(now());
        tableForUpdate.setSchema(toJsonNode(newSchema));

        schemasAndTablesRepository.save(tableForUpdate);

        return new Voidy();
    }
}
