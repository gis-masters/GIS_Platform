package ru.mycrg.data_service.service.cqrs.table_records.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.cqrs.table_records.requests.UpdateMultipleTableRecordRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.FeatureProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Objects.isNull;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.SchemaUtil.excludeComplexFields;
import static ru.mycrg.data_service.util.TableUtils.throwIfNotMatchTableColumns;

@Component
public class UpdateMultipleTableRecordRequestHandler implements IRequestHandler<UpdateMultipleTableRecordRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(UpdateMultipleTableRecordRequestHandler.class);

    private final SpatialRecordsDao spatialRecordsDao;
    private final SystemAttributeHandler systemAttributeHandler;
    private final DdlTables ddlTables;
    private final FeatureProtector featureProtector;

    public UpdateMultipleTableRecordRequestHandler(SpatialRecordsDao spatialRecordsDao,
                                                   SystemAttributeHandler systemAttributeHandler,
                                                   DdlTables ddlTables, FeatureProtector featureProtector) {
        this.spatialRecordsDao = spatialRecordsDao;
        this.systemAttributeHandler = systemAttributeHandler;
        this.ddlTables = ddlTables;
        this.featureProtector = featureProtector;
    }

    @Override
    public Voidy handle(UpdateMultipleTableRecordRequest request) {
        ResourceQualifier qualifier = request.getQualifier();
        SchemaDto schema = request.getSchema();
        Map<String, Object> properties = request.getProperties();
        List<Long> ids = request.getIds();

        if (!featureProtector.isEditAllowed(qualifier)) {
            throw new ForbiddenException(
                    "Таблица: '" + qualifier.getTableQualifier() + "' не доступна для обновления.");
        }

        throwIfNotMatchTableColumns(properties.keySet(), ddlTables.getAllColumnNames(qualifier.getTable()));
        Map<String, Object> propsWithoutComplexFields = excludeComplexFields(schema, properties);

        Feature newFeature = new Feature(new HashMap<>(propsWithoutComplexFields));

        systemAttributeHandler.initSchema(schema)
                              .prepareJsonb(newFeature)
                              .decapitalize(newFeature);

        if (isNull(schema.getCalcFiledFunction()) || schema.getCalcFiledFunction().isEmpty()) {
            log.debug("Update without calculated fields");
            multipleUpdate(qualifier, newFeature, schema, ids);
        } else {
            log.debug("Update with calculated fields");
            multipleUpdateWithCalculatedFields(qualifier, newFeature.getProperties(), schema, ids);
        }

        return new Voidy();
    }

    private void multipleUpdate(ResourceQualifier qualifier, Feature newFeature, SchemaDto schema,
                                List<Long> ids) {
        try {
            spatialRecordsDao.updateByIds(qualifier, newFeature, PRIMARY_KEY, schema, ids);
        } catch (CrgDaoException e) {
            String msg = "Не удалось выполнить multipleUpdate в таблице: " + qualifier.getTable();
            logError(msg, e);

            throw new DataServiceException(msg);
        }
    }

    private void multipleUpdateWithCalculatedFields(ResourceQualifier qualifier,
                                                    Map<String, Object> properties,
                                                    SchemaDto schema,
                                                    List<Long> ids) {
        List<Feature> oldFeatures = spatialRecordsDao.findByIds(qualifier, schema, ids);
        if (oldFeatures.isEmpty()) {
            return;
        }

        // path old props by new pros
        List<Feature> featuresForUpdate = new ArrayList<>();
        oldFeatures.forEach(oldFeature -> {
            Feature newFeature = new Feature(new HashMap<>(properties));

            Map<String, Object> oldProperties = oldFeature.getProperties();
            oldProperties.putAll(properties);

            // path old props by calculated values
            systemAttributeHandler.customRulesCalculation(oldProperties)
                                  .forEach(newFeature::setProperty);

            newFeature.setProperty(PRIMARY_KEY, oldFeature.getId());

            featuresForUpdate.add(newFeature);
        });

        try {
            spatialRecordsDao.batchUpdate(qualifier, featuresForUpdate, schema);
        } catch (CrgDaoException e) {
            String msg = "Не удалось выполнить multipleUpdateWithCalculatedFields в таблице: " + qualifier.getTable();
            logError(msg, e);

            throw new DataServiceException(msg);
        }
    }
}
