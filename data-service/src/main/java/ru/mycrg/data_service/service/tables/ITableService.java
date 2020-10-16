package ru.mycrg.data_service.service.tables;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.service.TableIdentifier;

public interface ITableService {

    Page<TableModel> getAllByTitle(String schemaName,
                                   String title,
                                   Pageable pageable,
                                   Authentication authentication);

    TableModel getByName(TableIdentifier resource, Authentication authentication);
}
