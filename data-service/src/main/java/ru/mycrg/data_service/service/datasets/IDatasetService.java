package ru.mycrg.data_service.service.datasets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

public interface IDatasetService {

    Page<IResourceModel> getPaged(String title, Pageable pageable, Authentication authentication);

    IResourceModel getByName(String name, Authentication authentication);

    IResourceModel create(ResourceCreateDto dto, Authentication authentication);

    void delete(ResourceIdentifier rIdentifier, Authentication authentication);
}
