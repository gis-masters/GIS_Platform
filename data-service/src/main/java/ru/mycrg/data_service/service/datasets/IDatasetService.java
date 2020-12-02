package ru.mycrg.data_service.service.datasets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.DatasetModel;

public interface IDatasetService {

    Page<DatasetModel> getPaged(String title, Pageable pageable, Authentication authentication);

    DatasetModel getByName(String name, Authentication authentication);

    DatasetModel create(ResourceCreateDto dto, Authentication authentication);

    void delete(String datasetId);
}
