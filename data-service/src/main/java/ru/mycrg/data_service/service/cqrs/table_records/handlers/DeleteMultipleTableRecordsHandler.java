package ru.mycrg.data_service.service.cqrs.table_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.table_records.requests.DeleteMultipleTableRecordsRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class DeleteMultipleTableRecordsHandler implements IRequestHandler<DeleteMultipleTableRecordsRequest, Voidy> {

    private final SpatialRecordsDao spatialRecordsDao;
    private final DdlTables ddlTables;

    public DeleteMultipleTableRecordsHandler(SpatialRecordsDao spatialRecordsDao, DdlTables ddlTables) {
        this.spatialRecordsDao = spatialRecordsDao;
        this.ddlTables = ddlTables;
    }

    @Override
    public Voidy handle(DeleteMultipleTableRecordsRequest request) {
        ResourceQualifier rQualifier = request.getrQualifiers();

        try {
            ddlTables.isExist(rQualifier);
            spatialRecordsDao.removeMultipleRecords(rQualifier, request.getIds());
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }

        return new Voidy();
    }
}
