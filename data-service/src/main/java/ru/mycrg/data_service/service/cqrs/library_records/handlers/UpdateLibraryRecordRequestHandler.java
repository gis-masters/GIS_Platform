package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.ddl.DdlTablesSpecial;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.cqrs.library_records.requests.UpdateLibraryRecordRequest;
import ru.mycrg.data_service.service.records.IRecordsService;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.lang.Boolean.TRUE;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.Roles.VIEWER;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service.util.TableUtils.throwIfNotMatchTableColumns;

@Component
public class UpdateLibraryRecordRequestHandler implements IRequestHandler<UpdateLibraryRecordRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(UpdateLibraryRecordRequestHandler.class);

    private final DocumentLibraryService librariesService;
    private final RecordServiceFactory recordServiceFactory;
    private final IAuthenticationFacade authenticationFacade;
    private final IMasterResourceProtector resourceProtector;
    private final SystemAttributeHandler systemAttributeHandler;
    private final DdlTablesSpecial ddlTablesSpecial;
    private final RecordsDao recordsDao;

    public UpdateLibraryRecordRequestHandler(DocumentLibraryService librariesService,
                                             RecordServiceFactory recordServiceFactory,
                                             IAuthenticationFacade authenticationFacade,
                                             MasterResourceProtector resourceProtector,
                                             SystemAttributeHandler systemAttributeHandler,
                                             DdlTablesSpecial ddlTablesSpecial,
                                             RecordsDao recordsDao) {
        this.librariesService = librariesService;
        this.recordServiceFactory = recordServiceFactory;
        this.authenticationFacade = authenticationFacade;
        this.resourceProtector = resourceProtector;
        this.systemAttributeHandler = systemAttributeHandler;
        this.ddlTablesSpecial = ddlTablesSpecial;
        this.recordsDao = recordsDao;
    }

    @Override
    public Voidy handle(UpdateLibraryRecordRequest request) {
        ResourceQualifier recordQualifier = request.getQualifier();
        IRecord newRecord = request.getNewRecord();

        SchemaDto schema = librariesService.getSchema(recordQualifier.getTable());
        SimplePropertyDto versions = new SimplePropertyDto();
        versions.setName(VERSIONS.getName());
        versions.setValueType(ValueType.VERSIONS);
        schema.addProperty(versions);

        IRecordsService recordsService = recordServiceFactory.get();
        IRecord currentRecordState = recordsService.getById(recordQualifier,
                                                            recordQualifier.getRecordIdAsLong(),
                                                            schema);
        request.setOldRecord(currentRecordState);

        updateRecord(recordQualifier, newRecord, schema, currentRecordState);

        return new Voidy();
    }

    private void updateRecord(ResourceQualifier recordQualifier,
                              IRecord newRecord,
                              SchemaDto schema,
                              IRecord oldRecordState) {

        if (!authenticationFacade.isOrganizationAdmin() && !authenticationFacade.isRoot()) {
            throwIfUpdateNotAllowed(recordQualifier, newRecord);
        }

        // update
        try {
            log.debug("try update record: {} by data: {}", recordQualifier.getQualifier(), newRecord);

            Map<String, Object> content = newRecord.getContent();
            List<String> allColumnNames = ddlTablesSpecial.getAllColumnNames(recordQualifier.getTable());
            throwIfNotMatchTableColumns(content.keySet(),
                                        allColumnNames);

            Map<String, Object> modifiedProps;
            LibraryModel libraryInfo = (LibraryModel) librariesService.getInfo(recordQualifier.getTable());
            if (TRUE.equals(libraryInfo.getVersioned())) {
                modifiedProps = systemAttributeHandler
                        .init(schema, content)
                        .clearSystemAttributes()
                        .prepareFilesAsJsonb()
                        .updateVersionsField(oldRecordState.getContent())
                        .updateLastModifiedAndUpdatedBy(allColumnNames)
                        .build();
            } else {
                modifiedProps = systemAttributeHandler
                        .init(schema, content)
                        .clearSystemAttributes()
                        .prepareFilesAsJsonb()
                        .updateLastModifiedAndUpdatedBy(allColumnNames)
                        .build();
            }

            newRecord.setContent(modifiedProps);

            recordsDao.updateRecordById(recordQualifier, modifiedProps, schema);

            log.debug("Record: '{}' successfully patched", recordQualifier.getRecordIdAsLong());
        } catch (CrgDaoException e) {
            throw new DataServiceException("Failed to update record: " + recordQualifier.getQualifier(), e.getCause());
        }
    }

    private void throwIfUpdateNotAllowed(ResourceQualifier lQualifier, IRecord record) {
        if (!resourceProtector.isEditAllowed(lQualifier)) {
            throw new ForbiddenException("Библиотека: '" + lQualifier + "' не доступна для обновления.");
        }

        String path = record.getAsString(PATH.getName());
        if (path != null && !ROOT_FOLDER_PATH.equals(path)) {
            Optional<Long> oLastFolderId = systemAttributeHandler.getLastIdFromPath(path);
            if (oLastFolderId.isEmpty()) {
                throw new BadRequestException("Задан некорректный путь: " + path);
            } else {
                Long lastFolderId = oLastFolderId.get();
                IRecordsService recordsService = recordServiceFactory.get();
                IRecord parentRecord = recordsService.getById(lQualifier, lastFolderId);
                String role = parentRecord.getAsString(ROLE.getName());
                if (VIEWER.name().equals(role)) {
                    String msg = "Папка: " + lastFolderId + " не доступна для обновления.";

                    throw new ForbiddenException(msg);
                }
            }
        }
    }
}
