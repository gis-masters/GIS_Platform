package ru.mycrg.data_service.service.datasets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

public interface IDatasetService {

    Page<IResourceModel> getPaged(String title, Pageable pageable);

    IResourceModel getInfo(ResourceIdentifier rIdentifier);

    IResourceModel create(ResourceCreateDto dto);

    void delete(ResourceIdentifier rIdentifier);
}
