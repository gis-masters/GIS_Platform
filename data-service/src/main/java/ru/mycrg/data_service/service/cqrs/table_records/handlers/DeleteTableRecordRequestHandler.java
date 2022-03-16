package ru.mycrg.data_service.service.cqrs.table_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.table_records.requests.DeleteTableRecordRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class DeleteTableRecordRequestHandler implements IRequestHandler<DeleteTableRecordRequest, Voidy> {

    private final SpatialRecordsDao spatialRecordsDao;

    public DeleteTableRecordRequestHandler(SpatialRecordsDao spatialRecordsDao) {
        this.spatialRecordsDao = spatialRecordsDao;
    }

    @Override
    public Voidy handle(DeleteTableRecordRequest request) {
        ResourceQualifier rQualifier = request.getQualifier();
        Feature feature = request.getFeature();

        try {
            spatialRecordsDao.removeRecord(rQualifier, feature.getId());
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }

        return new Voidy();
    }
}
