package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Map;
import java.util.Optional;

@Repository
@Transactional
public class SchemableRecordsDao {

    private final RecordsDao recordsDao;
    private final DocumentLibraryService librariesService;

    public SchemableRecordsDao(RecordsDao recordsDao,
                               DocumentLibraryService librariesService) {
        this.recordsDao = recordsDao;
        this.librariesService = librariesService;
    }

    public Optional<IRecord> findById(ResourceQualifier qualifier) {
        return recordsDao.findById(qualifier, getSchema(qualifier));
    }

    public void updateById(@NotNull ResourceQualifier qualifier,
                           @NotNull Map<String, Object> data) throws CrgDaoException {
        recordsDao.updateRecordById(qualifier, data, getSchema(qualifier));
    }

    private SchemaDto getSchema(ResourceQualifier qualifier) {
        return librariesService.getSchema(qualifier.getTable());
    }
}
