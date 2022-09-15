package ru.mycrg.data_service.service.cqrs.table_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.cqrs.table_records.requests.UpdateTableRecordRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.HashMap;
import java.util.Map;

import static com.google.common.primitives.Longs.asList;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.TableUtils.throwIfNotMatchTableColumns;

@Component
public class UpdateTableRecordRequestHandler implements IRequestHandler<UpdateTableRecordRequest, Voidy> {

    private final SpatialRecordsDao spatialRecordsDao;
    private final SystemAttributeHandler systemAttributeHandler;
    private final DdlTables ddlTables;

    public UpdateTableRecordRequestHandler(SpatialRecordsDao spatialRecordsDao,
                                           SystemAttributeHandler systemAttributeHandler,
                                           DdlTables ddlTables) {
        this.spatialRecordsDao = spatialRecordsDao;
        this.systemAttributeHandler = systemAttributeHandler;
        this.ddlTables = ddlTables;
    }

    @Override
    public Voidy handle(UpdateTableRecordRequest request) {
        ResourceQualifier rQualifier = request.getQualifier();
        SchemaDto schema = request.getSchema();
        Feature newFeature = request.getNewFeature();

        throwIfNotMatchTableColumns(newFeature.getPropertyNames(), ddlTables.getAllColumnNames(rQualifier.getTable()));

        Feature oldFeature = spatialRecordsDao.findById(rQualifier, schema)
                                              .orElseThrow(() -> new NotFoundException(rQualifier.getRecord()));
        request.setOldFeature(new Feature(new HashMap<>(oldFeature.getProperties())));

        systemAttributeHandler.initSchema(schema)
                              .prepareJsonb(newFeature)
                              .decapitalize(newFeature);

        // path old props by new pros
        Map<String, Object> oldProperties = oldFeature.getProperties();
        oldProperties.putAll(newFeature.getProperties());

        // path old props by calculated values
        systemAttributeHandler.customRulesCalculation(oldProperties)
                              .forEach(newFeature::setProperty);

        try {
            spatialRecordsDao.updateByIds(rQualifier, newFeature, PRIMARY_KEY, schema, asList(rQualifier.getRecord()));
        } catch (CrgDaoException e) {
            String msg = "Не удалось обновить фичу в таблице: " + rQualifier.getTable();
            logError(msg, e);

            throw new DataServiceException(msg);
        }

        return new Voidy();
    }
}
