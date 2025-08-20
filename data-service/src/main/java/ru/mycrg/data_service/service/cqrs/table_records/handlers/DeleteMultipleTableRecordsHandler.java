package ru.mycrg.data_service.service.cqrs.table_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseWriteDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesBase;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.table_records.requests.DeleteMultipleTableRecordsRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;

import static ru.mycrg.data_service.dao.config.DaoProperties.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.util.StringUtil.join;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.EXTENSION_TABLE_ID;

@Component
public class DeleteMultipleTableRecordsHandler implements IRequestHandler<DeleteMultipleTableRecordsRequest, Voidy> {

    private final DdlTablesBase ddlTablesBase;
    private final BaseWriteDao baseDao;
    private final SpatialRecordsDao spatialRecordsDao;

    public DeleteMultipleTableRecordsHandler(SpatialRecordsDao spatialRecordsDao,
                                             DdlTablesBase ddlTablesBase,
                                             BaseWriteDao baseDao) {
        this.spatialRecordsDao = spatialRecordsDao;
        this.ddlTablesBase = ddlTablesBase;
        this.baseDao = baseDao;
    }

    @Override
    public Voidy handle(DeleteMultipleTableRecordsRequest request) {
        ResourceQualifier rQualifier = request.getrQualifiers();

        try {
            if (ddlTablesBase.isExist(rQualifier)) {
                spatialRecordsDao.removeMultipleRecords(rQualifier, request.getIds());
                removeRecordsFromExtensionTableByObjectId(rQualifier, request.getIds());
            } else {
                throw new DataServiceException("Не найдена таблица: " + rQualifier.getQualifier());
            }
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }

        return new Voidy();
    }

    private void removeRecordsFromExtensionTableByObjectId(ResourceQualifier rQualifier, List<Long> objectIds)
            throws CrgDaoException {
        String extTableName = rQualifier.getTable() + EXTENSION_POSTFIX;
        ResourceQualifier extTable = new ResourceQualifier(rQualifier.getSchema(), extTableName);

        baseDao.removeRecord(extTable, EXTENSION_TABLE_ID.getName(), join(objectIds));
    }
}
