package ru.mycrg.data_service.service.document_library;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesSpecial;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.schemas.CustomRuleCalculator;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.schemas.SystemAttributeHandler;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.DocumentVersioningDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.util.EcqlFilterUtil.addAsEqual;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service.util.TableUtils.throwIfNotMatchTableColumns;

@Service
public class OwnerRecordsService implements IRecordsService {

    private final Logger log = LoggerFactory.getLogger(OwnerRecordsService.class);

    private final CustomRuleCalculator customRuleCalculator;
    private final DdlTablesSpecial ddlTablesSpecial;
    private final RecordsDao recordsDao;
    private final PermissionsService permissionsService;
    private final DocumentLibraryService librariesService;
    private final SystemAttributeHandler systemAttributeHandler;

    public OwnerRecordsService(CustomRuleCalculator customRuleCalculator,
                               DdlTablesSpecial ddlTablesSpecial,
                               RecordsDao recordsDao,
                               PermissionsService permissionsService,
                               DocumentLibraryService librariesService,
                               SystemAttributeHandler systemAttributeHandler) {
        this.customRuleCalculator = customRuleCalculator;
        this.ddlTablesSpecial = ddlTablesSpecial;
        this.recordsDao = recordsDao;
        this.librariesService = librariesService;
        this.permissionsService = permissionsService;
        this.systemAttributeHandler = systemAttributeHandler;
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

        ecqlFilter = ecqlFilter.toLowerCase().contains(IS_DELETED.getName())
                ? ecqlFilter
                : addAsEqual(ecqlFilter, IS_DELETED.getName(), "false");

        SchemaDto schema = librariesService.getSchema(lQualifier.getTable());
        List<IRecord> records = recordsDao.findAll(lQualifier, ecqlFilter, schema, pageable);
        long total = recordsDao.getTotal(lQualifier, ecqlFilter);

        return new PageImpl<>(records, pageable, total);
    }

    @Override
    public Page<IRecord> getAsRegistry(ResourceQualifier lQualifier, Pageable pageable, String ecqlFilter) {
        SchemaDto schema = librariesService.getSchema(lQualifier.getTable());
        if (ecqlFilter.isEmpty()) {
            ecqlFilter = "";
        }

        ecqlFilter = ecqlFilter.toLowerCase().contains(IS_DELETED.getName())
                ? ecqlFilter
                : addAsEqual(ecqlFilter, IS_DELETED.getName(), "false");

        List<IRecord> records = recordsDao.findAll(lQualifier, ecqlFilter, schema, pageable).stream()
                                          .filter(record -> record.getContent().get(PATH.getName()) != null)
                                          .collect(Collectors.toList());
        long total = recordsDao.getTotal(lQualifier, ecqlFilter);

        return new PageImpl<>(records, pageable, total);
    }

    @Override
    public IRecord getById(ResourceQualifier rQualifier, Object recordId) {
        SchemaDto schema = librariesService.getSchema(rQualifier.getTable());

        return getById(rQualifier, recordId, schema);
    }

    @Override
    public IRecord getById(ResourceQualifier rQualifier, Object recordId, SchemaDto schema) {
        IRecord record = recordsDao.findById(new ResourceQualifier(rQualifier, recordId, LIBRARY_RECORD), schema)
                                   .orElseThrow(() -> new NotFoundException(recordId));

        record.getContent().put(ROLE.getName(), OWNER.name());

        return record;
    }

    @Override
    public List<DocumentVersioningDto> getVersionsByRecordId(ResourceQualifier rQualifier, Object recordId) {
        IRecord record = getById(rQualifier, recordId);
        Object versions = record.getContent().get(VERSIONS.getName());
        if (versions == null) {
            return new ArrayList<>();
        }

        try {
            return (List<DocumentVersioningDto>) record.getContent().get(VERSIONS.getName());
        } catch (Exception e) {
            throw new DataServiceException("Не удалось получить версии документа: " + rQualifier);
        }
    }

    @Override
    public IRecord createRecord(ResourceQualifier lQualifier, IRecord record, SchemaDto schema) {
        try {
            log.debug("try create record: {}", record);

            Map<String, Object> props = record.getContent();
            List<String> allColumnNames = ddlTablesSpecial.getAllColumnNames(lQualifier.getTable());
            throwIfNotMatchTableColumns(props.keySet(), allColumnNames);

            Map<String, Object> modifiedProps = systemAttributeHandler
                    .init(schema, props)
                    .excludeAutoGeneratedFields()
                    .fillByContentType()
                    .addDefaultPath()
                    .prepareFilesAsJsonb()
                    .fillCreatorAndCreationDate(allColumnNames)
                    .updateLastModifiedAndUpdatedBy(allColumnNames)
                    .fillIsDeleted(allColumnNames, false)
                    .build();

            modifiedProps.putAll(customRuleCalculator.calculate(schema, modifiedProps));

            record.setContent(modifiedProps);

            IRecord newRecord = recordsDao.addRecord(lQualifier, record, schema);
            permissionsService.addOwnerPermission(lQualifier, newRecord.getId());

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

            Map<String, Object> content = record.getContent();
            throwIfNotMatchTableColumns(content.keySet(),
                                        ddlTablesSpecial.getAllColumnNames(recordQualifier.getTable()));

            Map<String, Object> modifiedProps = systemAttributeHandler
                    .init(schema, content)
                    .clearSystemAttributes()
                    .prepareFilesAsJsonb()
                    .build();

            record.setContent(modifiedProps);

            recordsDao.updateRecordById(recordQualifier, modifiedProps, schema);

            log.debug("Record: '{}' successfully patched", recordQualifier.getRecordIdAsLong());
        } catch (CrgDaoException e) {
            throw new DataServiceException("Failed to update record: " + recordQualifier.getQualifier(), e.getCause());
        }
    }

    @Override
    public void deleteRecord(@NotNull ResourceQualifier qualifier, @NotNull SchemaDto schema) throws CrgDaoException {
        List<String> allColumnNames = ddlTablesSpecial.getAllColumnNames(qualifier.getTable());

        Map<String, Object> data = systemAttributeHandler
                .init(schema, new HashMap<>())
                .updateLastModifiedAndUpdatedBy(allColumnNames)
                .fillIsDeleted(allColumnNames, true)
                .build();

        recordsDao.updateRecordById(qualifier, data, schema);
    }

    @Override
    public void recoverRecord(@NotNull ResourceQualifier qualifier,
                              @NotNull SchemaDto schema,
                              @NotNull String recoverPath) throws CrgDaoException {
        List<String> allColumnNames = ddlTablesSpecial.getAllColumnNames(qualifier.getTable());

        Map<String, Object> data = systemAttributeHandler
                .init(schema, new HashMap<>())
                .updateLastModifiedAndUpdatedBy(allColumnNames)
                .fillIsDeleted(allColumnNames, false)
                .build();
        data.put(PATH.getName(), recoverPath);

        recordsDao.updateRecordById(qualifier, data, schema);
    }
}
