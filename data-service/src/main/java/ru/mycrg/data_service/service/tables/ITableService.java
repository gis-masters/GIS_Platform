package ru.mycrg.data_service.service.tables;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

public interface ITableService {

    Page<IResourceModel> getPaged(String schemaName,
                                  String title,
                                  Pageable pageable,
                                  Authentication authentication);

    IResourceModel getByIdentifier(ResourceIdentifier rIdentifier, Authentication authentication);

    IResourceModel create(ResourceIdentifier resource, TableCreateDto dto, Authentication authentication);

    void delete(ResourceIdentifier resource, Authentication authentication);
}
