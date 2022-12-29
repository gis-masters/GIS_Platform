package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.List;
import java.util.Optional;

@Repository
public class SpatialRecordsSchemableDao {

    private final TableService tableService;
    private final SchemaService schemaService;
    private final SpatialRecordsDao spatialRecordsDao;

    public SpatialRecordsSchemableDao(TableService tableService,
                                      SchemaService schemaService,
                                      SpatialRecordsDao spatialRecordsDao) {
        this.tableService = tableService;
        this.schemaService = schemaService;
        this.spatialRecordsDao = spatialRecordsDao;
    }

    public Optional<Feature> findById(ResourceQualifier qualifier) {
        return spatialRecordsDao.findById(qualifier, getSchema(qualifier));
    }

    public List<Feature> findByIds(ResourceQualifier qualifier, List<Long> ids) {
        return spatialRecordsDao.findByIds(qualifier, getSchema(qualifier), ids);
    }

    public Feature save(@NotNull ResourceQualifier qualifier,
                        @NotNull Feature feature) throws CrgDaoException {
        return spatialRecordsDao.save(qualifier, feature, getSchema(qualifier));
    }

    public void updateByIds(ResourceQualifier qualifier,
                            Feature feature,
                            String primaryKey,
                            List<Long> ids) throws CrgDaoException {
        spatialRecordsDao.updateByIds(qualifier, feature, primaryKey, getSchema(qualifier), ids);
    }

    public void batchUpdate(ResourceQualifier qualifier,
                            List<Feature> features) throws CrgDaoException {
        spatialRecordsDao.batchUpdate(qualifier, features, getSchema(qualifier));
    }

    private SchemaDto getSchema(ResourceQualifier qualifier) {
        IResourceModel table = tableService.getInfo(qualifier);

        return schemaService.getSchemaByName(table.getSchemaId())
                            .orElseThrow(() -> new NotFoundException(table.getSchemaId()));
    }
}
