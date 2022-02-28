package ru.mycrg.data_service.service.records;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.util.EcqlFilterUtil.addAsEqual;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

@Service
public class OwnerRecordsService implements IRecordsService {

    private final RecordsDao recordsDao;
    private final UserRecordsService userRecordsService;
    private final DocumentLibraryService librariesService;

    public OwnerRecordsService(RecordsDao recordsDao,
                               UserRecordsService userRecordsService,
                               DocumentLibraryService librariesService) {
        this.recordsDao = recordsDao;
        this.userRecordsService = userRecordsService;
        this.librariesService = librariesService;
    }

    @Override
    public Page<IRecord> getPaged(ResourceQualifier lQualifier, Pageable pageable, Long parentId, String ecqlFilter) {
        String path = ROOT_FOLDER_PATH;
        if (parentId != null) {
            ResourceQualifier recordQualifier = new ResourceQualifier(lQualifier, parentId);
            SchemaDto schema = librariesService.getSchema(lQualifier.getTable());
            IRecord parent = recordsDao
                    .findById(recordQualifier, schema)
                    .orElseThrow(() -> new NotFoundException("Not found record by id: " + parentId));

            path = String.format("%s/%d", parent.getContent().get(PATH.getName()), parentId);
        }

        ecqlFilter = addAsEqual(ecqlFilter, PATH.getName(), path);

        SchemaDto schema = librariesService.getSchema(lQualifier.getTable());
        List<IRecord> records = recordsDao.findAll(lQualifier, ecqlFilter, schema, pageable);
        long total = recordsDao.getTotal(lQualifier, ecqlFilter);

        return new PageImpl<>(records, pageable, total);
    }

    @Override
    public Page<IRecord> getAsRegistry(ResourceQualifier lQualifier, Pageable pageable, String ecqlFilter) {
        SchemaDto schema = librariesService.getSchema(lQualifier.getTable());

        List<IRecord> records = recordsDao.findAll(lQualifier, ecqlFilter, schema, pageable).stream()
                                          .filter(record -> record.getContent().get(PATH.getName()) != null)
                                          .collect(Collectors.toList());
        long total = recordsDao.getTotal(lQualifier, ecqlFilter);

        return new PageImpl<>(records, pageable, total);
    }

    @Override
    public IRecord getById(ResourceQualifier rQualifier, Long recordId) {
        SchemaDto schema = librariesService.getSchema(rQualifier.getTable());

        return recordsDao.findById(new ResourceQualifier(rQualifier, recordId), schema)
                         .orElseThrow(() -> new NotFoundException(recordId));
    }

    @Override
    public IRecord createRecord(ResourceQualifier lQualifier, RecordEntity record, MultipartFile file) {
        return userRecordsService.createRecord(lQualifier, record, file);
    }

    @Override
    public void updateRecord(ResourceQualifier recordQualifier, IRecord record) {
        userRecordsService.updateRecord(recordQualifier, record);
    }

    @Override
    public void deleteRecord(ResourceQualifier resourceQualifier, Long id) throws CrgDaoException {
        userRecordsService.deleteRecord(resourceQualifier, id);
    }
}
