package ru.mycrg.data_service.service.resources.features;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.List;

@Service
public class BaseFeaturesReader implements IFeaturesReader {

    private final SpatialRecordsDao spatialRecordsDao;

    public BaseFeaturesReader(SpatialRecordsDao spatialRecordsDao) {
        this.spatialRecordsDao = spatialRecordsDao;
    }

    @Override
    public Page<Feature> getAll(ResourceQualifier tableQualifier,
                                SchemaDto schema,
                                String ecqlFilter,
                                Pageable pageable) {
        List<Feature> features = spatialRecordsDao.findAll(tableQualifier, ecqlFilter, schema, pageable);
        Long total = spatialRecordsDao.total(tableQualifier, ecqlFilter);

        return new PageImpl<>(features, pageable, total);
    }
}
