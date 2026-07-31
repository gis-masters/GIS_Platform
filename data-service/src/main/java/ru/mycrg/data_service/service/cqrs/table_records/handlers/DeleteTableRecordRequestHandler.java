package ru.mycrg.data_service.service.cqrs.table_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseWriteDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.table_records.requests.DeleteTableRecordRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.FeatureProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;

import static ru.mycrg.data_service.dao.config.DaoProperties.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.EXTENSION_TABLE_ID;

@Component
public class DeleteTableRecordRequestHandler implements IRequestHandler<DeleteTableRecordRequest, Voidy> {

    private final SpatialRecordsDao spatialRecordsDao;
    private final BaseWriteDao baseDao;
    private final FeatureProtector featureProtector;

    public DeleteTableRecordRequestHandler(SpatialRecordsDao spatialRecordsDao,
                                           BaseWriteDao baseDao,
                                           FeatureProtector featureProtector) {
        this.spatialRecordsDao = spatialRecordsDao;
        this.baseDao = baseDao;
        this.featureProtector = featureProtector;
    }

    @Override
    public Voidy handle(DeleteTableRecordRequest request) {
        ResourceQualifier rQualifier = request.getQualifier();
        SchemaDto schema = request.getSchema();
        Feature feature = request.getFeature();

        featureProtector.throwIsEditNotAllowed(rQualifier, schema);

        try {
            spatialRecordsDao.removeMultipleRecords(rQualifier, List.of(feature.getId()));
            removeRecordsFromExtensionTableByObjectId(rQualifier, feature.getId());
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }

        return new Voidy();
    }

    private void removeRecordsFromExtensionTableByObjectId(ResourceQualifier rQualifier, Long objectId)
            throws CrgDaoException {
        String extTableName = rQualifier.getTable() + EXTENSION_POSTFIX;
        ResourceQualifier extTable = new ResourceQualifier(rQualifier.getSchema(), extTableName);

        baseDao.removeRecord(extTable, EXTENSION_TABLE_ID.getName(), objectId);
    }
}
