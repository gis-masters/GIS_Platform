package ru.mycrg.data_service.service.records;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.RecordDto;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.service.records.RecordUtil.clearSystemAttributes;
import static ru.mycrg.data_service.util.EcqlFilterUtil.addAsEqual;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.LAST_MODIFIED;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

@Service
public class OwnerRecordsService implements IRecordsService {

    private final Logger log = LoggerFactory.getLogger(OwnerRecordsService.class);

    private final RecordsDao recordsDao;
    private final UserRecordsService userRecordsService;

    public OwnerRecordsService(RecordsDao recordsDao,
                               UserRecordsService userRecordsService) {
        this.recordsDao = recordsDao;
        this.userRecordsService = userRecordsService;
    }

    @Override
    public Page<RecordDto> getPaged(ResourceQualifier lQualifier, Pageable pageable, Long parentId, String ecqlFilter) {
        String path = ROOT_FOLDER_PATH;
        if (parentId != null) {
            ResourceQualifier recordQualifier = new ResourceQualifier(lQualifier, parentId);
            Map<String, Object> parent = recordsDao
                    .findById(recordQualifier)
                    .orElseThrow(() -> new NotFoundException("Not found record by id: " + parentId));

            path = String.format("%s/%d", parent.get(PATH.getName()), parentId);
        }

        ecqlFilter = addAsEqual(ecqlFilter, PATH.getName(), path);

        List<RecordDto> records = recordsDao.findAll(lQualifier, ecqlFilter, pageable);
        long total = recordsDao.getTotal(lQualifier, ecqlFilter);

        return new PageImpl<>(records, pageable, total);
    }

    @Override
    public Page<RecordDto> getAsRegistry(ResourceQualifier lQualifier, Pageable pageable, String ecqlFilter) {
        List<RecordDto> records = recordsDao.findAll(lQualifier, ecqlFilter, pageable).stream()
                                            .filter(record -> record.getContent().get(PATH.getName()) != null)
                                            .collect(Collectors.toList());
        long total = recordsDao.getTotal(lQualifier, ecqlFilter);

        return new PageImpl<>(records, pageable, total);
    }

    @Override
    public Map<String, Object> getById(ResourceQualifier rQualifier, Long recordId) {
        return recordsDao.findById(new ResourceQualifier(rQualifier, recordId))
                         .orElseThrow(() -> new NotFoundException(recordId));
    }

    @Override
    public IRecord createRecord(ResourceQualifier lQualifier, RecordEntity record, MultipartFile file) {
        return userRecordsService.createRecord(lQualifier, record, file);
    }

    @Override
    public void updateRecord(ResourceQualifier recordQualifier, Map<String, Object> payload) {
        ResourceQualifier tQualifier = new ResourceQualifier(recordQualifier.getSchema(),
                                                             recordQualifier.getTable());
        Map<String, Object> record = getById(tQualifier, recordQualifier.getRecord());

        try {
            log.debug("try update record: {} by data: {}", recordQualifier.getQualifier(), payload);

            Map<String, Object> newData = clearSystemAttributes(payload);
            newData.put(LAST_MODIFIED.getName(), LocalDateTime.now().format(ISO_LOCAL_DATE_TIME).replace("T", " "));

            newData.forEach((key, value) -> record.put(key, newData.get(key)));

            recordsDao.updateRecordById(recordQualifier, newData);

            log.debug("successfully patched");
        } catch (Exception e) {
            throw new DataServiceException("Failed to update record: " + recordQualifier.getQualifier(), e.getCause());
        }
    }

    @Override
    public void deleteRecord(ResourceQualifier resourceQualifier, Long id) throws CrgDaoException {
        userRecordsService.deleteRecord(resourceQualifier, id);
    }
}
