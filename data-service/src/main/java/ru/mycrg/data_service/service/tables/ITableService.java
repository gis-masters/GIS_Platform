package ru.mycrg.data_service.service.tables;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

public interface ITableService {

    Page<IResourceModel> getPaged(String dataset, String title, Pageable pageable);

    IResourceModel getByIdentifier(ResourceIdentifier rIdentifier);

    IResourceModel create(ResourceIdentifier resource, TableCreateDto dto);

    void delete(ResourceIdentifier resource);
}
