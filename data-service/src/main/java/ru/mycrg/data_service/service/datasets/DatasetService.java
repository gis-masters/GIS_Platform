package ru.mycrg.data_service.service.datasets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.SchemasDDL;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.repository.ResourceDescriptionRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.security.CrgClaimsParser.isOrganizationAdmin;
import static ru.mycrg.data_service.security.CrgClaimsParser.isRoot;
import static ru.mycrg.data_service.service.PageHandler.getPageableResource;

@Service
public class DatasetService implements IDatasetService {

    private final SchemasDDL schemasDDL;
    private final ResourceDescriptionRepository rdRepository;

    public DatasetService(SchemasDDL schemasDDL,
                          ResourceDescriptionRepository rdRepository) {
        this.schemasDDL = schemasDDL;
        this.rdRepository = rdRepository;
    }

    @Override
    public Page<DatasetModel> getAllByTitle(String title,
                                            Pageable pageable,
                                            Authentication authentication) {
        if (isRoot(authentication)) {
            return (Page<DatasetModel>) getPageableResource(new ArrayList<>(), pageable);
        } else if (isOrganizationAdmin(authentication)) {
            final Set<DatasetModel> datasets = new LinkedHashSet<>();

            // Схемы с описанием
            rdRepository.findByTypeAndTitleContaining(SCHEMA.name(), title, pageable)
                        .forEach(description -> datasets.add(new DatasetModel(description, OWNER.name())));

            datasets.forEach(datasetModel -> {
                Long countTables = schemasDDL.countTables(datasetModel.getResourceIdentifier());

                datasetModel.setTableCount(countTables.intValue());
            });

            return (Page<DatasetModel>) getPageableResource(Arrays.asList(datasets.toArray()), pageable);
        } else {
            return (Page<DatasetModel>) getPageableResource(new ArrayList<>(), pageable);
        }
    }

    @Override
    public DatasetModel getByName(String schemaName, Authentication authentication) {
        if (isRoot(authentication)) {
            return new DatasetModel();
        } else if (isOrganizationAdmin(authentication)) {
            final DatasetModel datasetModel = rdRepository
                    .findByTypeAndResourceIdentifier(SCHEMA.name(), schemaName)
                    .map(resourceDescription -> new DatasetModel(resourceDescription, OWNER.name()))
                    .orElseGet(() -> new DatasetModel(schemaName, OWNER.name()));

            datasetModel.setTableCount(schemasDDL.getTables(schemaName).size());

            return datasetModel;
        } else {
            return new DatasetModel();
        }
    }
}
