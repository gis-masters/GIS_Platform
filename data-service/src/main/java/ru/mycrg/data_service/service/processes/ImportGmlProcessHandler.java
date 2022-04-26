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
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.JsonConverter;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.import_.ImportGml;
import ru.mycrg.data_service.service.import_.model.ImportGmlModel;
import ru.mycrg.data_service.service.import_.model.WsImportModel;
import ru.mycrg.data_service.service.processes.dto.ImportInitializingModel;
import ru.mycrg.data_service.service.processes.dto.ImportSource;
import ru.mycrg.data_service.service.processes.dto.ImportTarget;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.*;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT_GML;

@Component
public class ImportGmlProcessHandler implements IProcessHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGmlProcessHandler.class);

    private final ImportGml importGml;
    private final ProcessService processService;
    private final FileStorageService fileStorageService;
    private final RecordServiceFactory recordServiceFactory;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;

    private final URL gisServiceUrl;
    private final HttpClient httpClient;

    private UUID wsMsgId;
    private IRecord record;
    private ImportInitializingModel importInitialData;

    public ImportGmlProcessHandler(ProcessService processService,
                                   ImportGml importGml,
                                   Environment environment,
                                   FileStorageService fileStorageService,
                                   RecordServiceFactory recordServiceFactory,
                                   IAuthenticationFacade authenticationFacade,
                                   WsNotificationService wsNotificationService) throws MalformedURLException {
        this.processService = processService;
        this.importGml = importGml;
        this.fileStorageService = fileStorageService;
        this.recordServiceFactory = recordServiceFactory;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;

        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    @Override
    public Process handle() {
        log.debug("Handle importGmlProcess: {}", this.importInitialData);

        String databaseName = getDefaultDatabaseName(authenticationFacade.getOrganizationId());
        Process process = processService.create(authenticationFacade.getLogin(),
                                                "Import gml",
                                                getType(),
                                                importInitialData);

        sendWsMsg(PENDING, null, "Инициализация...");

        SecurityContext securityContext = SecurityContextHolder.getContext();
        DelegatingSecurityContextRunnable wrappedRunnable = new DelegatingSecurityContextRunnable(() -> {
            try {
                ImportTarget importTarget = this.importInitialData.getTarget();

                ImportGmlModel importGmlModel = fetchDataNeededForImport();
                Resource resource = fileStorageService.loadAsResource(importGmlModel.getPath());

                sendWsMsg(PENDING, null, "Импорт данных...");
                ImportReport importReport = importGml.doImport(resource, importGmlModel);

                String projectName = importTarget.getProjectName();
                if (importTarget.isProjectIsNew()) {
                    sendWsMsg(PENDING, null, "Создание проекта...");

                    createProject(projectName).ifPresentOrElse(projectId -> {
                        joinLayers(projectId, importReport);

                        importReport.setProjectId(projectId);
                        importReport.setProjectName(projectName);
                        importReport.setProjectIsNew(true);
                        importReport.setSuccess(true);

                        processService.complete(databaseName, process.getId(), JsonConverter.toJsonNode(importReport));
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

                    joinLayers(importTarget.getProjectId(), importReport);

                    importReport.setProjectName(projectName);
                    importReport.setProjectId(importTarget.getProjectId());
                    importReport.setProjectIsNew(false);
                    importReport.setSuccess(true);

                    processService.complete(databaseName, process.getId(), JsonConverter.toJsonNode(importReport));
                    sendWsMsg(DONE, importReport, "Импорт GML завершен");
                }
            } catch (Exception e) {
                String msg = "Не удалось выполнить импорт GML файла. Причина: " + e.getMessage();
                ImportReport importReport = new ImportReport(msg);

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
        ImportTarget target = this.importInitialData.getTarget();
        if (!target.isProjectIsNew() && isProjectNotAllowed(target.getProjectId())) {
            throw new BadRequestException("Проект '" + target.getProjectName() + "' не доступен для записи");
        }

        return this;
    }

    @Override
    public IProcessHandler setPayload(ImportInitializingModel importInitialData, IRecord record) {
        this.wsMsgId = UUID.randomUUID();
        this.record = record;
        this.importInitialData = importInitialData;

        return this;
    }

    @Override
    public ProcessType getType() {
        return IMPORT_GML;
    }

    private void sendWsMsg(ProcessStatus status, ImportReport payload, String msg) {
        wsNotificationService.send(
                new WsMessageDto<>(IMPORT_GML,
                                   new WsImportModel(wsMsgId, status, payload, msg)),
                importInitialData.getWsUiId()
        );
    }

    @NotNull
    private ImportGmlModel fetchDataNeededForImport() {
        try {
            ImportSource source = this.importInitialData.getSource();

            String libraryId = source.getLibraryId();
            Long objectId = source.getObjectId();
            ResourceQualifier tQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, libraryId);

            Map<String, Object> data = recordServiceFactory.get().getById(tQualifier, objectId).getContent();

            String title = (String) data.get(TITLE.getName());
            String documentType = (String) data.get("document_type");
            String details = (String) data.get("details");

            LocalDateTime aDate = null;
            if (Objects.nonNull(data.get("approve_date"))) {
                aDate = LocalDateTime.parse(data.get("approve_date").toString(),
                                            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            }

            Integer scale = Integer.parseInt(String.valueOf(data.get("scale")));
            boolean coordinateInverted = this.importInitialData.getInvertedCoordinates();
            String oktmo = (String) data.get(OKTMO.getName());
            String path = (String) data.get(INNER_PATH.getName());

            if (title == null || path == null) {
                throw new IllegalStateException("Отсутствует один из обязательных атрибутов для импорта GML");
            }

            return new ImportGmlModel(title, documentType, details, aDate, scale, oktmo, path, coordinateInverted);
        } catch (Exception e) {
            String msg;
            if (e.getMessage() != null) {
                msg = "Документ не содержит необходимых атрибутов: " + e.getMessage();
            } else {
                msg = "Документ не содержит необходимых атрибутов";
            }

            throw new IllegalStateException(msg);
        }
    }

    private Optional<Long> createProject(String projectName) {
        try {
            RequestBody payload = RequestBody.create(MediaType.parse("application/json"),
                                                     "{\"projectName\":\"" + projectName + "\"}");
            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, "/projects"))
                    .post(payload)
                    .build();

            ResponseModel<ProjectModel> response = httpClient.handleRequest(request, ProjectModel.class);
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

    // TODO: Extract to gis-service client
    private boolean isProjectNotAllowed(Long projectId) {
        try {
            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, "/projects/" + projectId))
                    .get()
                    .build();

            ResponseModel<Map> responseModel = httpClient.handleRequest(request, Map.class);
            if (responseModel.isSuccessful()) {
                return responseModel.getBody().get("role").equals("VIEWER");
            } else {
                return true;
            }
        } catch (HttpClientException | MalformedURLException e) {
            return true;
        }
    }

    private void joinLayers(Long projectId, ImportReport importReport) {
        String dataStoreName = getScratchWorkspaceName(authenticationFacade.getOrganizationId());
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

    public class ProjectModel {

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
