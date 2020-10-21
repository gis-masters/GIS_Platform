package ru.mycrg.data_service.service.datasets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.repository.ResourceDescriptionRepository;

import java.util.ArrayList;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.security.CrgClaimsParser.isOrganizationAdmin;
import static ru.mycrg.data_service.security.CrgClaimsParser.isRoot;

@Service
public class DatasetService implements IDatasetService {

    private final ResourceDescriptionRepository rdRepository;

    public DatasetService(ResourceDescriptionRepository rdRepository) {
        this.rdRepository = rdRepository;
    }

    @Override
    public Page<DatasetModel> getAllByTitle(String title,
                                            Pageable pageable,
                                            Authentication authentication) {
        if (isRoot(authentication)) {
            return new PageImpl<>(new ArrayList<>());
        } else if (isOrganizationAdmin(authentication)) {
            return rdRepository
                    .findByTypeAndTitleContaining(SCHEMA.name(), title, pageable)
                    .map(description -> new DatasetModel(description, OWNER.name()));
        } else {
            return new PageImpl<>(new ArrayList<>());
        }
    }

    @Override
    public DatasetModel getByName(String schemaName, Authentication authentication) {
        if (isRoot(authentication)) {
            return new DatasetModel();
        } else if (isOrganizationAdmin(authentication)) {
            return rdRepository
                    .findByTypeAndResourceIdentifier(SCHEMA.name(), schemaName)
                    .map(resourceDescription -> new DatasetModel(resourceDescription, OWNER.name()))
                    .orElseGet(() -> new DatasetModel(schemaName, OWNER.name()));
        } else {
            return new DatasetModel();
        }
    }
}
