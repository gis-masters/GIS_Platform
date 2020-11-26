package ru.mycrg.data_service.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.entity.TableObjectImpl;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
public class ObjectService {

    private final TablesDao tablesDao;

    public ObjectService(TablesDao tablesDao) {
        this.tablesDao = tablesDao;
    }

    public Map<String, Object> getById(ResourceIdentifier table, UUID id, Authentication authentication) {
        return tablesDao
                .findById(table, id)
                .orElseThrow(() -> {
                    throw new NotFoundException(id);
                });
    }

    public ITableObject createObject(ResourceIdentifier resource,
                                     Map<String, Object> body,
                                     Authentication authentication) throws CrgDaoException {
        UUID id = tablesDao.addRecord(resource, body);

        return new TableObjectImpl(id);
    }

    public void deleteObject(ResourceIdentifier resourceIdentifier, UUID id, Authentication authentication) {
        tablesDao.removeRecord(resourceIdentifier, id);
    }
}
