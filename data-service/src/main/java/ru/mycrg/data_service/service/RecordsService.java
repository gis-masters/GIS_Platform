package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.entity.TableObjectImpl;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import java.util.Map;
import java.util.UUID;

@Service
public class RecordsService {

    public static final Logger log = LoggerFactory.getLogger(RecordsService.class);

    private final TablesDao tablesDao;

    public RecordsService(TablesDao tablesDao) {
        this.tablesDao = tablesDao;
    }

    public Page<Map<String, Object>> getPaged(ResourceIdentifier rIdentifier,
                                              Pageable pageable,
                                              String parent,
                                              Authentication authentication) {
        try {
            return tablesDao.findAllPaged(rIdentifier, pageable, parent);
        } catch (CrgDaoException e) {
            log.error(e.getMessage());
            throw new DataServiceException("Failed obtain records from: " + rIdentifier.toString());
        }
    }

    public Map<String, Object> getById(ResourceIdentifier resourceIdentifier,
                                       UUID recordId,
                                       Authentication authentication) {
        return tablesDao
                .findById(resourceIdentifier, recordId)
                .orElseThrow(() -> {
                    throw new NotFoundException(recordId);
                });
    }

    public ITableObject createRecord(ResourceIdentifier resource,
                                     Map<String, Object> body,
                                     Authentication authentication) throws CrgDaoException {
        UUID id = tablesDao.addRecord(resource, body);

        return new TableObjectImpl(id);
    }

    public void deleteRecord(ResourceIdentifier resourceIdentifier, UUID id, Authentication authentication) {
        tablesDao.removeRecord(resourceIdentifier, id);
    }
}
