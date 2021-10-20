package ru.mycrg.data_service.service.processes;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.security.concurrent.DelegatingSecurityContextRunnable;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.JsonConverter;
import ru.mycrg.data_service.service.RecordsService;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.import_.ImportGml;
import ru.mycrg.data_service.service.import_.model.ImportGmlModel;
import ru.mycrg.data_service.service.import_.model.ImportGmlRequestModel;
import ru.mycrg.data_service.service.import_.model.WsImportGmlModel;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.validators.ImportGmlValidator;
import ru.mycrg.data_service_contract.dto.ImportLayerReport;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.enums.ProcessType;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.data_service.DataServiceApplication.gson;
import static ru.mycrg.data_service.dao.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.*;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT_GML;

@Component
public class ImportGmlProcessHandler implements IProcessHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGmlProcessHandler.class);

    private final ImportGml importGml;
    private final ProcessService processService;
    private final RecordsService recordsService;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;

    private final URL gisServiceUrl;
    private final HttpClient httpClient;

    private ImportGmlRequestModel importGmlRequestModel;
    private UUID wsMsgId;
    private String wsUiId;

    public ImportGmlProcessHandler(ProcessService processService,
                                   ImportGml importGml,
                                   Environment environment,
                                   RecordsService recordsService,
                                   FileStorageService fileStorageService,
                                   IAuthenticationFacade authenticationFacade,
                                   WsNotificationService wsNotificationService) throws MalformedURLException {
        this.processService = processService;
        this.importGml = importGml;
        this.recordsService = recordsService;
        this.fileStorageService = fileStorageService;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;

        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    @Override
    public Process handle() {
        log.debug("Handle importGmlProcess: {}", this.importGmlRequestModel);

        final String databaseName = getDefaultDatabaseName(authenticationFacade.getOrganizationId());
        Process process = processService.create(authenticationFacade.getLogin(),
                                                "Import gml",
                                                getType(),
                                                importGmlRequestModel);

        sendWsMsg(PENDING, null, "Инициализация...");

        SecurityContext securityContext = SecurityContextHolder.getContext();
        DelegatingSecurityContextRunnable wrappedRunnable = new DelegatingSecurityContextRunnable(() -> {
            try {
                final ImportGmlModel importGmlModel = fetchDataNeededForImport();
                final Resource resource = fileStorageService.loadAsResource(importGmlModel.getFileName());

                sendWsMsg(PENDING, null, "Импорт данных...");
                ImportReport importReport = importGml.doImport(resource, importGmlModel);

                final String projectName = this.importGmlRequestModel.getProjectName();
                if (this.importGmlRequestModel.isProjectIsNew()) {
                    sendWsMsg(PENDING, null, "Создание проекта...");

                    createProject(projectName).ifPresentOrElse(projectId -> {
                        joinLayers(projectId, importReport);

                        importReport.setProjectId(projectId);
                        importReport.setProjectName(projectName);
                        importReport.setProjectIsNew(true);
                        importReport.setSuccess(true);
                        try {
                            processService.complete(databaseName,
                                                    process.getId(),
                                                    JsonConverter.toJsonNode(importReport));
                        } catch (SQLException e) {
                            log.error("Failed to complete process: {}", process.getId());
                        }

                        sendWsMsg(DONE, importReport, "Импорт GML завершен");
                    }, () -> {
                        String msg = "Не удалось выполнить импорт GML файла. Причина: Не удалось создать проект";
                        importReport.setReason(msg);
                        importReport.setSuccess(false);

                        log.error(msg);
                        processService.error(databaseName, process.getId(), JsonConverter.toJsonNode(importReport));
                        sendWsMsg(ERROR, importReport, msg);
                    });
                } else {
                    sendWsMsg(PENDING, null, "Подключение слоёв к проекту...");

                    joinLayers(this.importGmlRequestModel.getProjectId(), importReport);

                    importReport.setProjectName(projectName);
                    importReport.setProjectId(this.importGmlRequestModel.getProjectId());

                    sendWsMsg(DONE, importReport, "Импорт GML завершен");
                }
            } catch (Exception e) {
                String msg = "Не удалось выполнить импорт GML файла. Причина: " + e.getMessage();
                final ImportReport importReport = new ImportReport(msg);

                log.error(msg, e.getCause());
                processService.error(databaseName, process.getId(), JsonConverter.toJsonNode(importReport));
                sendWsMsg(ERROR, importReport, msg);
            }
        }, securityContext);
        new Thread(wrappedRunnable).start();

        return process;
    }

    @Override
    public IProcessHandler validate() {
        ImportGmlValidator.throwIfNotValid(this.importGmlRequestModel);

        return this;
    }

    @Override
    public IProcessHandler setPayload(Object data) {
        try {
            this.importGmlRequestModel = gson.fromJson(gson.toJson(data), ImportGmlRequestModel.class);
            this.wsUiId = this.importGmlRequestModel.getWsUiId();
            this.wsMsgId = UUID.randomUUID();
            this.importGmlRequestModel.setWsMsgId(wsMsgId);

            return this;
        } catch (Exception e) {
            throw new BadRequestException("No readable data: " + data.toString());
        }
    }

    @Override
    public ProcessType getType() {
        return IMPORT_GML;
    }

    private void sendWsMsg(ProcessStatus status, ImportReport payload, String msg) {
        wsNotificationService.send(
                new WsMessageDto<>(IMPORT_GML,
                                   new WsImportGmlModel(wsMsgId, status, payload, msg)),
                wsUiId
        );
    }

    @NotNull
    private ImportGmlModel fetchDataNeededForImport() {
        final String libraryId = this.importGmlRequestModel.getLibraryId();
        final Long objectId = this.importGmlRequestModel.getObjectId();
        final ResourceQualifier tableQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, libraryId);

        final Map<String, Object> data = recordsService.getById(tableQualifier, objectId);

        final String title = (String) data.get(TITLE.getName());
        final String documentType = (String) data.get("document_type");
        final String details = (String) data.get("details");
        final LocalDateTime approveDate = LocalDateTime.parse(data.get("approve_date").toString(),
                                                              DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        final int scale = Integer.parseInt(String.valueOf(data.get("scale")));
        final String oktmo = (String) data.get(OKTMO.getName());
        final String fileName = (String) data.get(INNER_PATH.getName());

        return new ImportGmlModel(title, documentType, details, approveDate, scale, oktmo, fileName, false);
    }

    private Optional<Long> createProject(String projectName) {
        try {
            final RequestBody payload = RequestBody.create(MediaType.parse("application/json"),
                                                           "{\"projectName\":\"" + projectName + "\"}");
            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, "/projects"))
                    .post(payload)
                    .build();

            final ResponseModel<ProjectModel> response = httpClient.handleRequest(request, ProjectModel.class);
            if (response.isSuccessful()) {
                return Optional.of(response.getBody().getId());
            } else {
                return Optional.empty();
            }
        } catch (HttpClientException | MalformedURLException e) {
            log.error("Не удалось создать проект: {}", e.getMessage(), e.getCause());

            return Optional.empty();
        }
    }

    private void joinLayers(Long projectId, ImportReport importReport) {
        final String dataStoreName = getScratchWorkspaceName(authenticationFacade.getOrganizationId());
        importReport.getImportLayerReports().stream()
                    .filter(ImportLayerReport::isSuccess)
                    .forEach(importLayerReport -> {
                        joinLayer(projectId, dataStoreName, importReport.getDatasetIdentifier(), importLayerReport);
                    });
    }

    private boolean joinLayer(Long projectId, String dataStoreName, String dataset, ImportLayerReport layerReport) {
        try {
            RequestBody payload = RequestBody.create(
                    MediaType.parse("application/json"),
                    "{" +
                            "    \"tableName\": \"" + layerReport.getTableIdentifier() + "\"," +
                            "    \"type\": \"vector\"," +
                            "    \"title\": \"" + layerReport.getTableTitle() + "\"," +
                            "    \"dataset\": \"" + dataset + "\"," +
                            "    \"nativeCRS\": \"" + layerReport.getCrs() + "\"," +
                            "    \"dataStoreName\": \"" + dataStoreName + "\"," +
                            "    \"schemaId\": \"" + layerReport.getSchemaId() + "\"," +
                            "    \"styleName\": \"" + layerReport.getSchemaId() + "\"" +
                            "}");

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, String.format("/projects/%d/layers", projectId)))
                    .post(payload)
                    .build();

            return httpClient.handleRequest(request).isSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    private class ProjectModel {

        private Long id;
        private Long organizationId;
        private String name;
        private String internalName;
        private String createdAt;
        private String role;

        public ProjectModel() {
            // Required
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getOrganizationId() {
            return organizationId;
        }

        public void setOrganizationId(Long organizationId) {
            this.organizationId = organizationId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getInternalName() {
            return internalName;
        }

        public void setInternalName(String internalName) {
            this.internalName = internalName;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
