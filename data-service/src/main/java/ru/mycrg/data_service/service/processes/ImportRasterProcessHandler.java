package ru.mycrg.data_service.service.processes;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.concurrent.DelegatingSecurityContextRunnable;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.JsonConverter;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.import_.model.WsImportModel;
import ru.mycrg.data_service.service.processes.dto.ImportInitializingModel;
import ru.mycrg.data_service.service.processes.dto.ImportTarget;
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
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.*;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT_RASTER;

@Component
public class ImportRasterProcessHandler implements IProcessHandler {

    private final Logger log = LoggerFactory.getLogger(ImportRasterProcessHandler.class);

    private final ProcessService processService;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;

    private final URL gisServiceUrl;
    private final HttpClient httpClient;

    private UUID wsMsgId;
    private IRecord record;
    private ImportInitializingModel importInitialData;

    public ImportRasterProcessHandler(Environment environment,
                                      ProcessService processService,
                                      IAuthenticationFacade authenticationFacade,
                                      WsNotificationService wsNotificationService) throws MalformedURLException {
        this.processService = processService;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;

        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    @Override
    public Process handle() {
        log.debug("Handle import raster");

        String databaseName = getDefaultDatabaseName(authenticationFacade.getOrganizationId());
        Process process = processService.create(authenticationFacade.getLogin(),
                                                "Import raster",
                                                getType(),
                                                null);

        sendWsMsg(PENDING, null, "Инициализация...");

        SecurityContext securityContext = SecurityContextHolder.getContext();
        DelegatingSecurityContextRunnable wrappedRunnable = new DelegatingSecurityContextRunnable(() -> {
            try {
                ImportReport importReport = new ImportReport();

                ImportTarget importTarget = this.importInitialData.getTarget();
                String projectName = importTarget.getProjectName();
                if (importTarget.isProjectIsNew()) {
                    sendWsMsg(PENDING, importReport, "Создание проекта...");

                    createProject(projectName).ifPresentOrElse(projectId -> {
                        createLayer(projectId, importReport);

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

                        sendWsMsg(DONE, importReport, "Импорт растра завершен");
                    }, () -> {
                        String msg = "Не удалось выполнить импорт растра. Причина: Не удалось создать проект";
                        importReport.setReason(msg);
                        importReport.setSuccess(false);

                        log.error(msg);
                        processService.error(databaseName, process.getId(), JsonConverter.toJsonNode(importReport));
                        sendWsMsg(ERROR, importReport, msg);
                    });
                } else {
                    sendWsMsg(PENDING, null, "Подключение слоёв к проекту...");

                    createLayer(importTarget.getProjectId(), importReport);

                    importReport.setProjectName(projectName);
                    importReport.setProjectId(importTarget.getProjectId());

                    sendWsMsg(DONE, importReport, "Импорт растра завершен");
                }
            } catch (Exception e) {
                String msg = "Не удалось выполнить импорт растра. Причина: " + e.getMessage();
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
        // Проверить физическое наличие файла
        // Проверить наличие и адекватность данных у записи

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
        return IMPORT_RASTER;
    }

    private void sendWsMsg(ProcessStatus status, ImportReport report, String msg) {
        wsNotificationService.send(
                new WsMessageDto<>(IMPORT_RASTER,
                                   new WsImportModel(wsMsgId, status, report, msg)),
                importInitialData.getWsUiId()
        );
    }

    private boolean createLayer(Long projectId, ImportReport importReport) {
        try {
            String layerName = "layer_" + StringUtils.stripFilenameExtension(record.getInnerPath());
            String dataStoreName = "store_" + layerName;
            String dataSourceUri = "file:///opt/file_storage/" + record.getInnerPath();

            RequestBody payload = RequestBody.create(
                    MediaType.parse("application/json"),
                    "{" +
                            "    \"type\": \"raster\"," +
                            "    \"title\": \"" + record.getTitle() + "\"," +
                            "    \"nativeCRS\": \"" + record.getAsString("native_crs") + "\"," +
                            "    \"tableName\": \"" + layerName + "\"," +
                            "    \"dataStoreName\": \"" + dataStoreName + "\"," +
                            "    \"dataSourceUri\": \"" + dataSourceUri + "\"" +
                            "}");

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, String.format("/projects/%d/layers", projectId)))
                    .post(payload)
                    .build();

            ResponseModel<Object> responseModel = httpClient.handleRequest(request);
            if (responseModel.isSuccessful()) {
                importReport.addImportLayerReport(new ImportLayerReport(layerName));

                return true;
            } else {
                importReport.addImportLayerReport(new ImportLayerReport(layerName, false, responseModel.getMsg()));

                return false;
            }
        } catch (Exception e) {
            return false;
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

            ResponseModel<ImportGmlProcessHandler.ProjectModel> response = httpClient
                    .handleRequest(request, ImportGmlProcessHandler.ProjectModel.class);
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
}
