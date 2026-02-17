package ru.mycrg.integration_service.bpmn.gpkg.import_.main;

import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.ProjectBaseProjection;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.io.IOException;
import java.net.URL;
import java.util.Optional;

import static ru.mycrg.common_contracts.enums.Roles.VIEWER;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ACTIVE;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.http_client.JsonConverter.fromJson;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.NO_ACCESS_TO_PROJECT;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.PROJECT_ACCESS_HTTP_FAILED;

@Service("checkAccessToProject")
public class CheckAccessToProject implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(CheckAccessToProject.class);

    private final BaseHttpService baseHttpService;
    private final GpkgReportManager reportManager;

    public CheckAccessToProject(BaseHttpService baseHttpService,
                                GpkgReportManager reportManager) {
        this.baseHttpService = baseHttpService;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        int currentIteration = (int) delegateExecution.getVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS);
        if (currentIteration >= 4) {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, PROJECT_ACCESS_HTTP_FAILED.getValue());

            return;
        }

        log.debug("Класс {} начал работу.", CheckAccessToProject.class.getSimpleName());
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(IMPORT_GPKG_EVENT_REPORT);

        Long projectId = event.getProjectId();
        String token = event.getToken();
        Optional<ProjectBaseProjection> oProject = getProjectById(projectId,
                                                                  token,
                                                                  delegateExecution,
                                                                  currentIteration);

        if (oProject.isEmpty()) {
            log.debug("У пользователя не хватает прав что бы смотреть на проект.");
            reportManager.createProjectRepWithError(rabbitDto,
                                                    importReport,
                                                    projectId,
                                                    "Проект с ID: " + projectId + " недоступен");

            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, NO_ACCESS_TO_PROJECT.getValue());

            return;
        }
        ProjectBaseProjection project = oProject.get();

        reportManager.createProjectReport(rabbitDto, importReport, projectId, project.getName());

        if (project.getRole() != VIEWER) {
            log.debug("У пользователя хватает прав что бы создавать слои в проекте.");
            reportManager.updateProjectReport(rabbitDto, importReport, ACTIVE);

            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, 0);
        } else {
            String msg = "У пользователя нет прав редактировать проект '" + project.getName() + "'";
            log.debug(msg);

            reportManager.updateProjectReport(rabbitDto, importReport, ERROR, msg);

            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, NO_ACCESS_TO_PROJECT.getValue());
        }
    }

    private Optional<ProjectBaseProjection> getProjectById(Long projectId,
                                                           String token,
                                                           DelegateExecution delegateExecution,
                                                           int currentIteration) throws IOException {
        URL gisServiceUrl = baseHttpService.getGisServiceUrl();
        URL getLayersList = new URL(gisServiceUrl, "/projects/" + projectId);

        Request req = new Request.Builder()
                .addHeader("Authorization", "Bearer " + token)
                .addHeader("Content-Type", "application/json")
                .url(getLayersList)
                .get()
                .build();

        try (Response response = httpClient.newCall(req).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                Optional<ProjectBaseProjection> project = fromJson(response.body().string(),
                                                                   ProjectBaseProjection.class);

                log.debug("Получен ответ от GIS сервиса: {}", project);

                return project;
            } else {
                int statusCode = response.code();
                log.warn("GIS сервис вернул неуспешный статус: {} для запроса прав на проект с ID: {}", statusCode,
                         projectId);

                // Временные ошибки - можно повторить
                if (statusCode == 503 || statusCode == 502 || statusCode == 504 || statusCode == 429) {
                    delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

                    throw new BpmnError("responseTimeOut");
                }
            }

            return Optional.empty();
        } catch (IOException e) {
            log.error("Ошибка ввода-вывода при запросе прав проекта с ID {}: {}", projectId, e.getMessage(), e);
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        } catch (Exception e) {
            log.error("Ошибка парсинга ответа при запросе прав проекта с ID {}: {}", projectId, e.getMessage(), e);

            return Optional.empty();
        }
    }
}
