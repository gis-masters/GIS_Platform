package ru.mycrg.data_service.service.smev3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.fields.FieldsEisZs;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

/**
 * Обработка записей  dl_data_eis_zs
 */
@Service
public class DataEisZsService {
    private final Logger log = LoggerFactory.getLogger(DataEisZsService.class);
    private final RecordsDao recordsDao;
    private final ISchemaTemplateService schemaService;
    private final ResourceQualifier qualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, FieldsEisZs.TABLE);
    private SchemaDto schema = null;

    public DataEisZsService(RecordsDao recordsDao, ISchemaTemplateService schemaService) {
        this.recordsDao = recordsDao;
        this.schemaService = schemaService;
    }

    @Transactional
    public void updateExists(String fieldName, IRecord record) {
        log.debug("try to update 'dl_data_eis_zs' record: " + record);

        if (schema == null) {
            schema = schemaService.getSchemaByName(FieldsEisZs.TABLE).orElseThrow();
        }

        findByPermitNumber(fieldName, record.getAsString(fieldName)).ifPresentOrElse(
                iRecord -> {
                    try {
                        record.getContent().put(FieldsEisZs.ID, iRecord.getId());
                        var updateQualifier = new ResourceQualifier(
                                SYSTEM_SCHEMA_NAME,
                                FieldsEisZs.TABLE,
                                iRecord.getId(),
                                TABLE
                        );
                        recordsDao.updateRecordById(updateQualifier, record.getContent(), schema);
                        log.info("record 'dl_data_eis_zs' updated: " + record);
                    } catch (CrgDaoException e) {
                        throw new SmevRequestException("Не удалось обновить запись " + e.getMessage());
                    }
                },
                () -> {
                    try {
                        recordsDao.addRecord(qualifier, record, schema);
                        log.info("record 'dl_data_eis_zs' added: " + record);
                    } catch (CrgDaoException e) {
                        throw new SmevRequestException("Не удалось создать запись " + e.getMessage());
                    }
                }
        );
    }

    @Transactional
    public void addOrIgnoreRecords(String fieldName, List<IRecord> records) {
        log.debug("try to add 'dl_data_eis_zs' records count: " + records.size());

        if (schema == null) {
            schema = schemaService.getSchemaByName(FieldsEisZs.TABLE)
                    .orElseThrow(() -> new SmevRequestException("Не удалось найти схему таблицы " + FieldsEisZs.TABLE));
        }

        records
                .stream()
                .filter(iRecord -> ifRecordNotExist(iRecord, fieldName))
                .forEach(iRecord -> {
                    try {
                        recordsDao.addRecord(qualifier, iRecord, schema);
                        log.info("record 'dl_data_eis_zs' added: " + iRecord);
                    } catch (CrgDaoException e) {
                        throw new SmevRequestException(e.getMessage());
                    }
                });
    }

    private boolean ifRecordNotExist(IRecord iRecord, String fieldName) {
        return findByPermitNumber(fieldName, iRecord.getAsString(fieldName)).isEmpty();
    }

    private Optional<IRecord> findByPermitNumber(String fieldName, String permitNumber) {
        var condition = String.format("%s = '%s'", fieldName, permitNumber);
        return recordsDao.findBy(qualifier, condition);
    }
}
