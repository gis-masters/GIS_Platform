package ru.mycrg.data_service.service.cqrs.datasets.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.ResourceUpdateDto;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.cqrs.datasets.requests.UpdateDatasetRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import static java.util.Objects.nonNull;

@Component
public class UpdateDatasetRequestHandler implements IRequestHandler<UpdateDatasetRequest, Voidy> {

    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final IResourceProtector datasetProtector;

    public UpdateDatasetRequestHandler(SchemasAndTablesRepository schemasAndTablesRepository,
                                       IResourceProtector datasetProtector) {
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.datasetProtector = datasetProtector;
    }

    @Override
    public Voidy handle(UpdateDatasetRequest request) {
        ResourceQualifier dQualifier = request.getdQualifier();
        ResourceUpdateDto dto = request.getDto();
        String datasetId = dQualifier.getQualifier();

        SchemasAndTables datasetForUpdate = schemasAndTablesRepository
                .findByIdentifier(datasetId)
                .orElseThrow(() -> new NotFoundException("Не найден набор данных: " + datasetId));

        if (datasetProtector.isOwner(dQualifier)) {
            // Edit record from schemasAndTables
            if (nonNull(dto.getTitle())) {
                datasetForUpdate.setTitle(dto.getTitle());
            }

            if (nonNull(dto.getDetails())) {
                datasetForUpdate.setDetails(dto.getDetails());
            }

            request.setDatasetModel(datasetForUpdate);

            schemasAndTablesRepository.save(datasetForUpdate);
        } else {
            throw new ForbiddenException(
                    "Недостаточно прав для редактирования информации о наборе данных: " + datasetId);
        }

        return new Voidy();
    }
}
