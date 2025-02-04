package ru.mycrg.data_service.service.smev3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.config.DaoProperties;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.fields.FieldsEisZs;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.systemTable;

/**
 * Обработка записей  dl_data_eis_zs
 */
@Service
public class DataEisZsServiceImpl implements DataEisZsService {

    private final Logger log = LoggerFactory.getLogger(DataEisZsServiceImpl.class);

    private final RecordsDao recordsDao;
    private final ISchemaTemplateService schemaService;
    private final ResourceQualifier qualifier = systemTable(FieldsEisZs.TABLE);
    private SchemaDto schema = null;

    public DataEisZsServiceImpl(RecordsDao recordsDao, ISchemaTemplateService schemaService) {
        this.recordsDao = recordsDao;
        this.schemaService = schemaService;
    }

    @Transactional
    public void updateExists(String fieldName, IRecord recordXml) {
        log.debug("Попытка обработать запись 'dl_data_eis_zs': {}", recordXml);
        loadSchema();

        findByPermitNumber(fieldName, recordXml.getAsString(fieldName)).ifPresentOrElse(
                existsRecord -> {
                    try {
                        recordXml.getContent().put(DaoProperties.ID, existsRecord.getId());
                        recordsDao.updateRecordById(
                                new ResourceQualifier(qualifier, existsRecord.getId(), TABLE),
                                recordXml.getContent(),
                                schema
                        );
                        log.info("Обновлена имеющеюся запись 'dl_data_eis_zs': {}", recordXml);
                    } catch (CrgDaoException e) {
                        throw new SmevRequestException("Не удалось обновить запись " + e.getMessage());
                    }
                },
                () -> {
                    try {
                        recordsDao.addRecord(qualifier, recordXml, schema);
                        log.info("Добавлена новая запись 'dl_data_eis_zs': {} ", recordXml);
                    } catch (CrgDaoException e) {
                        throw new SmevRequestException("Не удалось создать запись " + e.getMessage());
                    }
                }
        );
    }

    @Transactional
    public void addOrIgnoreRecords(String fieldName, List<IRecord> recordsXml) {
        log.debug("Попытка добавить {} записей 'dl_data_eis_zs'", recordsXml.size());
        loadSchema();

        recordsXml
                .stream()
                .filter(iRecord -> ifRecordNotExist(iRecord, fieldName))
                .forEach(iRecord -> {
                    try {
                        recordsDao.addRecord(qualifier, iRecord, schema);
                        log.info("Добавлена новая запись 'dl_data_eis_zs': {}", iRecord);
                    } catch (CrgDaoException e) {
                        throw new SmevRequestException(e.getMessage());
                    }
                });
    }

    private boolean ifRecordNotExist(IRecord record, String fieldName) {
        return findByPermitNumber(fieldName, record.getAsString(fieldName)).isEmpty();
    }

    private Optional<IRecord> findByPermitNumber(String fieldName, String permitNumber) {
        var condition = String.format("%s = '%s'", fieldName, permitNumber);
        return recordsDao.findBy(qualifier, condition);
    }

    private void loadSchema() {
        if (schema == null) {
            schema = schemaService
                    .getSchemaByName(qualifier.getTable())
                    .orElseThrow(
                            () -> new SmevRequestException("Не удалось найти схему таблицы " + qualifier.getTable()));
        }
    }
}
