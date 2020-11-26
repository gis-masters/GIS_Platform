package ru.mycrg.data_service.service.tables;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

public interface ITableService {

    Page<TableModel> getPaged(String schemaName,
                              String title,
                              Pageable pageable,
                              Authentication authentication);

    TableModel getByIdentifier(ResourceIdentifier rIdentifier, Authentication authentication);

    TableModel create(ResourceIdentifier resource, ResourceCreateDto dto, Authentication authentication);
}
