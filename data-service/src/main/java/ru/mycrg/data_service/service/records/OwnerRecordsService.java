package ru.mycrg.data_service.service.records;

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
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;

@Service
public class OwnerRecordsService implements IRecordsService {

    private final RecordsDao recordsDao;
    private final UserRecordsService userRecordsService;

    public OwnerRecordsService(RecordsDao recordsDao,
                               UserRecordsService userRecordsService) {
        this.recordsDao = recordsDao;
        this.userRecordsService = userRecordsService;
    }

    @Override
    public Page<RecordDto> getPaged(ResourceQualifier lQualifier, Pageable pageable, Long parentId, String title) {
        String path = ROOT_FOLDER_PATH;
        if (parentId != null) {
            ResourceQualifier recordQualifier = new ResourceQualifier(lQualifier, parentId);
            Map<String, Object> parent = recordsDao
                    .findById(recordQualifier)
                    .orElseThrow(() -> new NotFoundException("Not found record by id: " + parentId));

            path = String.format("%s/%d", parent.get("path"), parentId);
        }

        List<RecordDto> records = recordsDao.findAllByPath(lQualifier, path, title, pageable);
        long total = recordsDao.getTotalByPath(lQualifier, path, title);

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
        userRecordsService.updateRecord(recordQualifier, payload);
    }

    @Override
    public void deleteRecord(ResourceQualifier resourceQualifier, Long id) throws CrgDaoException {
        userRecordsService.deleteRecord(resourceQualifier, id);
    }
}
