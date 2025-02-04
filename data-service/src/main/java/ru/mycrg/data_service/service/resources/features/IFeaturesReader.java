package ru.mycrg.data_service.service.resources.features;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

public interface IFeaturesReader {

    Page<Feature> getAll(ResourceQualifier resourceQualifier,
                         SchemaDto schema,
                         String ecqlFilter,
                         Pageable pageable);
}
