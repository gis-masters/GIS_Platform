package ru.mycrg.data_service.service.cqrs.table_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.cqrs.table_records.requests.CreateTableRecordRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequestHandler;

import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.TableUtils.throwIfNotMatchTableColumns;

@Component
public class CreateTableRecordRequestHandler implements IRequestHandler<CreateTableRecordRequest, Feature> {

    private final SystemAttributeHandler systemAttributeHandler;
    private final SpatialRecordsDao spatialRecordsDao;
    private final DdlTables ddlTables;

    public CreateTableRecordRequestHandler(SystemAttributeHandler systemAttributeHandler,
                                           SpatialRecordsDao spatialRecordsDao,
                                           DdlTables ddlTables) {
        this.systemAttributeHandler = systemAttributeHandler;
        this.spatialRecordsDao = spatialRecordsDao;
        this.ddlTables = ddlTables;
    }

    @Override
    public Feature handle(CreateTableRecordRequest request) {
        Feature feature = request.getFeature();
        SchemaDto schema = request.getSchema();

        systemAttributeHandler.initSchema(schema)
                              .prepareJsonb(feature)
                              .decapitalize(feature);

        systemAttributeHandler.customRulesCalculation(feature.getProperties())
                              .forEach(feature::setProperty);

        ResourceQualifier qualifier = request.getQualifier();

        throwIfNotMatchTableColumns(feature.getPropertyNames(), ddlTables.getAllColumnNames(qualifier.getTable()));

        try {
            Feature newFeature = spatialRecordsDao.save(qualifier, feature, schema);
            request.setFeature(newFeature);

            return newFeature;
        } catch (CrgDaoException e) {
            String msg = "Не удалось создать фичу в таблице: " + qualifier.getTable();
            logError(msg, e);

            throw new DataServiceException(msg);
        }
    }
}
