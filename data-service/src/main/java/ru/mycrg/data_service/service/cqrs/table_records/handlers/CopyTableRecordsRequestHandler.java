package ru.mycrg.data_service.service.cqrs.table_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.cqrs.table_records.requests.CopyTableRecordsRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.FeatureProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.TableUtils.throwIfNotMatchTableColumns;

@Component
public class CopyTableRecordsRequestHandler implements IRequestHandler<CopyTableRecordsRequest, Voidy> {

    private final SystemAttributeHandler systemAttributeHandler;
    private final SpatialRecordsDao spatialRecordsDao;
    private final DdlTables ddlTables;
    private final FeatureProtector featureProtector;

    public CopyTableRecordsRequestHandler(SystemAttributeHandler systemAttributeHandler,
                                          SpatialRecordsDao spatialRecordsDao, DdlTables ddlTables,
                                          FeatureProtector featureProtector) {
        this.systemAttributeHandler = systemAttributeHandler;
        this.spatialRecordsDao = spatialRecordsDao;
        this.ddlTables = ddlTables;
        this.featureProtector = featureProtector;
    }

    @Override
    public Voidy handle(CopyTableRecordsRequest request) {
        ResourceQualifier sourceQualifier = request.getSourceQualifier();
        ResourceQualifier targetQualifier = request.getTargetQualifier();
        SchemaDto schemaSource = request.getSchemaSource();
        SchemaDto schemaTarget = request.getSchemaTarget();
        List<Long> featureIds = request.getFeatureIds();

        if (!featureProtector.isEditAllowed(targetQualifier)) {
            String message = format("Недостаточно прав для записи в таблицу: %s", targetQualifier.getTableQualifier());

            throw new ForbiddenException(message);
        } else {
            checkIsTableColumnsExist(schemaSource, schemaTarget, sourceQualifier, targetQualifier);

            List<Long> copiedIds = spatialRecordsDao.copyRecords(targetQualifier.getTableQualifier(),
                                                                 sourceQualifier.getTableQualifier(),
                                                                 schemaTarget, schemaSource, featureIds);

            if (nonNull(schemaTarget.getCalcFiledFunction())) {
                updateCalculatedFiled(copiedIds, schemaTarget, targetQualifier);
            }

            return new Voidy();
        }
    }

    private void checkIsTableColumnsExist(SchemaDto schemaSource, SchemaDto schemaTarget,
                                          ResourceQualifier qualifierSource, ResourceQualifier qualifierTarget) {
        Set<String> propNamesSource = schemaSource.getProperties()
                                                  .stream()
                                                  .map(SimplePropertyDto::getName)
                                                  .collect(Collectors.toSet());
        Set<String> propNamesTarget = schemaTarget.getProperties()
                                                  .stream()
                                                  .map(SimplePropertyDto::getName)
                                                  .collect(Collectors.toSet());

        throwIfNotMatchTableColumns(propNamesSource, ddlTables.getAllColumnNames(qualifierSource.getTable()));
        throwIfNotMatchTableColumns(propNamesTarget, ddlTables.getAllColumnNames(qualifierTarget.getTable()));
    }

    private void updateCalculatedFiled(List<Long> idsForUpdate, SchemaDto tSchema, ResourceQualifier tQualifier) {
        List<Feature> features = spatialRecordsDao.findByIds(tQualifier, tSchema, idsForUpdate);

        List<Feature> featuresForUpdate = new ArrayList<>();
        features.forEach(oldFeature -> {
            Feature newFeature = new Feature();

            Map<String, Object> oldProperties = oldFeature.getProperties();

            // path old props by calculated values
            systemAttributeHandler.initSchema(tSchema)
                                  .customRulesCalculation(oldProperties)
                                  .forEach(newFeature::setProperty);

            newFeature.setProperty(PRIMARY_KEY, oldFeature.getId());

            featuresForUpdate.add(newFeature);
        });

        try {
            spatialRecordsDao.batchUpdate(tQualifier, featuresForUpdate, tSchema);
        } catch (CrgDaoException e) {
            String msg = "Не удалось выполнить multipleUpdateWithCalculatedFields в таблице: " + tQualifier.getTable();
            logError(msg, e);

            throw new DataServiceException(msg);
        }
    }
}
