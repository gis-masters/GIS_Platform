package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesSpecial;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.service.cqrs.library_records.requests.UpdateLibraryRecordRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.document_library.IRecordsService;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.data_service.service.schemas.SystemAttributeHandler;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.mediator.IRequestHandler;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.lang.Boolean.TRUE;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.Roles.VIEWER;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service.util.TableUtils.throwIfNotMatchTableColumns;

@Component
public class UpdateLibraryRecordRequestHandler implements IRequestHandler<UpdateLibraryRecordRequest, ResponseWithReport> {

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
    public ResponseWithReport handle(UpdateLibraryRecordRequest request) {
        log.debug("UpdateLibraryRecordRequestHandler: {}", request.getNewRecord().getContent());

        ResourceQualifier recordQualifier = request.getQualifier();

        SchemaDto schema = librariesService.getSchema(recordQualifier.getTable());
        SimplePropertyDto versions = new SimplePropertyDto();
        versions.setName(VERSIONS.getName());
        versions.setValueType(ValueType.VERSIONS);
        schema.addProperty(versions);

        IRecord currentRecordState = recordServiceFactory.get()
                                                         .getById(recordQualifier,
                                                                  recordQualifier.getRecordIdAsLong(),
                                                                  schema);
        request.setOldRecord(currentRecordState);

        Map<String, Object> updatedProps = updateRecord(recordQualifier,
                                                        request.getNewRecord(),
                                                        schema,
                                                        currentRecordState);

        ResponseWithReport responseWithReport = request.getResponseWithReport();
        responseWithReport.setContent(updatedProps);

        return responseWithReport;
    }

    private Map<String, Object> updateRecord(ResourceQualifier recordQualifier,
                                             IRecord newRecordState,
                                             SchemaDto schema,
                                             IRecord oldRecordState) {
        if (!authenticationFacade.isOrganizationAdmin() && !authenticationFacade.isRoot()) {
            throwIfUpdateNotAllowed(recordQualifier, newRecordState);
        }

        // update
        try {
            log.debug("try update record: {} by data: {}", recordQualifier.getQualifier(), newRecordState);

            Map<String, Object> content = newRecordState.getContent();
            List<String> allColumnNames = ddlTablesSpecial.getAllColumnNames(recordQualifier.getTable());

            throwIfNotMatchTableColumns(content.keySet(), allColumnNames);

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

            newRecordState.setContent(modifiedProps);

            recordsDao.updateRecordById(recordQualifier, modifiedProps, schema);

            log.debug("Record: '{}' successfully patched", recordQualifier.getRecordIdAsLong());

            return modifiedProps;
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
