package ru.mycrg.data_service.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.TablesDDL;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.entity.TableObjectImpl;
import ru.mycrg.data_service.exceptions.NotFoundException;

import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
public class ObjectService {

    private final TablesDDL tablesDDL;
    private final TablesDao tablesDao;

    public ObjectService(TablesDao tablesDao,
                         TablesDDL tablesDDL) {
        this.tablesDao = tablesDao;
        this.tablesDDL = tablesDDL;
    }

    public Map<String, Object> getById(TableIdentifier table, UUID id, Authentication authentication) {
        if (!tablesDDL.isTableExist(table)) {
            throw new NotFoundException(table.toString());
        }

        return tablesDao
                .findById(table, id)
                .orElseThrow(() -> {
                    throw new NotFoundException(id);
                });
    }

    public ITableObject createObject(TableIdentifier resource,
                                     Map<String, Object> body,
                                     Authentication authentication) throws CrgDaoException {
        if (!tablesDDL.isTableExist(resource)) {
            throw new NotFoundException(resource.toString());
        }

        UUID id = tablesDao.addRecord(resource, body);

        return new TableObjectImpl(id);
    }

    public void deleteObject(TableIdentifier tableIdentifier, UUID id, Authentication authentication) {
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            throw new NotFoundException(tableIdentifier.toString());
        }

        tablesDao.removeRecord(tableIdentifier, id);
    }
}
