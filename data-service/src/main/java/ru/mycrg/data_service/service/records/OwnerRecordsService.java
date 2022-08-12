package ru.mycrg.data_service.service.records;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.binary_analyzers.SimpleIntentHandler;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.util.EcqlFilterUtil.addAsEqual;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;
import static ru.mycrg.data_service.util.TableUtils.throwIfNotMatchTableColumns;

@Service
public class OwnerRecordsService implements IRecordsService {

    private final Logger log = LoggerFactory.getLogger(OwnerRecordsService.class);

    private final RecordsDao recordsDao;
    private final FileStorageService fileStorageService;
    private final PermissionsService permissionsService;
    private final SimpleIntentHandler simpleIntentHandler;
    private final DocumentLibraryService librariesService;
    private final SystemAttributeHandler systemAttributeHandler;
    private final DdlTables ddlTables;

    public OwnerRecordsService(RecordsDao recordsDao,
                               FileStorageService fileStorageService,
                               PermissionsService permissionsService,
                               SimpleIntentHandler simpleIntentHandler,
                               DocumentLibraryService librariesService,
                               SystemAttributeHandler systemAttributeHandler,
                               DdlTables ddlTables) {
        this.recordsDao = recordsDao;
        this.fileStorageService = fileStorageService;
        this.permissionsService = permissionsService;
        this.simpleIntentHandler = simpleIntentHandler;
        this.librariesService = librariesService;
        this.systemAttributeHandler = systemAttributeHandler;
        this.ddlTables = ddlTables;
    }

    @Override
    public Page<IRecord> getPaged(ResourceQualifier lQualifier, Pageable pageable, Long parentId, String ecqlFilter) {
        String path = ROOT_FOLDER_PATH;
        if (parentId != null) {
            ResourceQualifier recordQualifier = new ResourceQualifier(lQualifier, parentId, LIBRARY_RECORD);
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

        return recordsDao.findById(new ResourceQualifier(rQualifier, recordId, LIBRARY_RECORD), schema)
                         .orElseThrow(() -> new NotFoundException(recordId));
    }

    @Override
    public IRecord createRecord(ResourceQualifier lQualifier, IRecord record, MultipartFile file, SchemaDto schema) {
        try {
            log.debug("try create record: {}", record);

            Map<String, Object> props = record.getContent();
            systemAttributeHandler.initSchema(schema)
                                  .fillByContentType(props)
                                  .addDefaultPath(props)
                                  .fillCreator(props)
                                  .updateModifiedTime(record)
                                  .prepareJsonb(record);

            if (file != null) {
                if (file.isEmpty()) {
                    throw new BadRequestException("File is empty");
                }

                String path = fileStorageService.storeFile(file, fileStorageService.generateFileName(file));

                systemAttributeHandler.initSchema(schema)
                                      .fillFileInfo(props, file)
                                      .prepareJsonb(record)
                                      .fillFileInnerPath(props, path);
            }

            props.putAll(systemAttributeHandler.customRulesCalculation(props));

            throwIfNotMatchTableColumns(props, ddlTables.getAllColumnNames(lQualifier.getTable()));
            simpleIntentHandler.updateIntents(record);
            IRecord newRecord = recordsDao.addRecord(lQualifier, record, schema);
            permissionsService.addOwnerPermission(lQualifier, record.getId());

            return newRecord;
        } catch (CrgDaoException e) {
            if (e.hasErrors()) {
                List<ErrorInfo> errorInfoList = new ArrayList<>();
                e.getErrors().forEach((field, msg) -> errorInfoList.add(new ErrorInfo(field, msg)));

                throw new BadRequestException(e.getMessage(), errorInfoList);
            } else {
                throw new DataServiceException(e.getMessage(), e.getCause());
            }
        }
    }

    // Есть некий confusing пока идёт переход от сервисов к cqrs и его обработчикам команд.
    // По-идее всё должно переехать в обработчики.
    @Override
    public void updateRecord(ResourceQualifier recordQualifier, IRecord record, SchemaDto schema) {
        try {
            log.debug("try update record: {} by data: {}", recordQualifier.getQualifier(), record);

            Map<String, Object> clearedData = systemAttributeHandler.initSchema(schema)
                                                                    .prepareJsonb(record)
                                                                    .clearSystemAttributes(record);

            throwIfNotMatchTableColumns(record.getContent(), ddlTables.getAllColumnNames(recordQualifier.getTable()));

            recordsDao.updateRecordById(recordQualifier, clearedData, schema);

            log.debug("Record: '{}' successfully patched", recordQualifier.getRecord());
        } catch (CrgDaoException e) {
            throw new DataServiceException("Failed to update record: " + recordQualifier.getQualifier(), e.getCause());
        }
    }

    @Override
    public void deleteRecord(ResourceQualifier resourceQualifier, Long id) throws CrgDaoException {
        recordsDao.removeRecord(resourceQualifier, id);
    }
}
