package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.entity.TableObjectImpl;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Map;
import java.util.UUID;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

@Service
public class RecordsService {

    public static final Logger log = LoggerFactory.getLogger(RecordsService.class);

    private final TablesDao tablesDao;
    private final FileStorageService fileStorageService;
    private final SystemAttributeHandler systemAttributeHandler;

    public RecordsService(TablesDao tablesDao,
                          FileStorageService fileStorageService,
                          SystemAttributeHandler systemAttributeHandler) {
        this.tablesDao = tablesDao;
        this.fileStorageService = fileStorageService;
        this.systemAttributeHandler = systemAttributeHandler;
    }

    public Page<Map<String, Object>> getPaged(ResourceIdentifier rIdentifier,
                                              SchemaDto schema,
                                              Pageable pageable,
                                              CrgFilter filter) {
        try {
            return tablesDao.findPagedByFilter(rIdentifier, schema, pageable, filter);
        } catch (CrgDaoException e) {
            log.error(e.getMessage());
            throw new DataServiceException("Failed obtain records from: " + rIdentifier.toString());
        }
    }

    public Map<String, Object> getById(ResourceIdentifier resourceIdentifier, UUID recordId) {
        return tablesDao.findById(resourceIdentifier, recordId)
                        .orElseThrow(() -> new NotFoundException(recordId));
    }

    public ITableObject createRecord(ResourceIdentifier rIdentifier,
                                     Map<String, Object> body,
                                     MultipartFile file) {
        try {
            String innerFileName = UUID.randomUUID().toString();

            systemAttributeHandler.initSchema(rIdentifier.getId())
                                  .fillCreator(body)
                                  .fillTimes(body)
                                  .fillFileInfo(body, file)
                                  .fillFileInnerName(body, innerFileName);

            if (file != null) {
                if (file.isEmpty()) {
                    throw new BadRequestException("File is empty");
                }

                fileStorageService.storeFile(file, innerFileName);
            }

            UUID uuid = UUID.randomUUID();
            body.put(ID.getName(), uuid);

            tablesDao.addRecord(rIdentifier, body);

            return new TableObjectImpl(uuid);
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }
    }

    public void deleteRecord(ResourceIdentifier resourceIdentifier, UUID id) throws CrgDaoException {
        tablesDao.removeRecord(resourceIdentifier, id);
    }
}
