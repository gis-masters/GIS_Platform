package ru.mycrg.integration_service.bpmn.gpkg.import_;

import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportDestinationProject;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.ProjectBaseProjection;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.common_contracts.enums.Roles.VIEWER;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ACTIVE;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.http_client.JsonConverter.fromJson;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

/**
 * Класс для импорта GPKG. (первый в цепочке)
 *
 * <h3>Репорт на этом этапе:</h3>
 * <ul>
 *   <li>Количество и состав таблиц которые внутри gpkg</li>
 * </ul>
 */

@Service("checkAccessToProject")
public class CheckAccessToProject implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(CheckAccessToProject.class);

    private final BaseHttpService baseHttpService;
    private final IMessageBusProducer messageBus;

    public CheckAccessToProject(BaseHttpService baseHttpService,
                                IMessageBusProducer messageBus) {
        this.baseHttpService = baseHttpService;
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        int currentIteration = (int) getVariable(delegateExecution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        if (currentIteration >= 4) {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "noAccess");

            return;
        }

        log.debug("Класс {} начал работу.", CheckAccessToProject.class.getSimpleName());
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

        Long projectId = event.getProjectId();
        String token = event.getToken();

        GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(EVENT_IMPORT_GPKG_REPORT_NAME);
        GpkgPayloadData payload = importReport.getPayload();

        GpkgImportDestinationProject projectReport = new GpkgImportDestinationProject(projectId);

        Optional<ProjectBaseProjection> project = getProjectById(projectId, token, delegateExecution, currentIteration);

        if (project.isEmpty()) {
            log.debug("У пользователя не хватает прав что бы смотреть на проект.");

            projectReport.setStatus(ERROR);
            projectReport.setMessages(List.of("Проект с ID: " + projectId + " недоступен"));
            payload.setProject(projectReport);
            importReport.setPayload(payload);

            delegateExecution.setVariable(EVENT_IMPORT_GPKG_REPORT_NAME, importReport);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "noAccess");

            return;
        }

        projectReport.setTitle(project.get().getName());

        if (project.get().getRole() != VIEWER) {
            log.debug("У пользователя хватает прав что бы создавать слои в проекте.");

            projectReport.setStatus(ACTIVE);
            payload.setProject(projectReport);

            String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);
            PatchProcess newDetails = new PatchProcess(TASK_DONE, payload);
            messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                      businessKey,
                                                      event.getDbName(),
                                                      newDetails));

            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, 0);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "haveAccess");
        } else {
            log.debug("У пользователя не хватает прав что бы создать слои в проекте.");

            projectReport.setStatus(ERROR);
            projectReport.setMessages(
                    List.of("У пользователя нет прав редактировать проект '" + project.get().getName() + "'"));
            payload.setProject(projectReport);

            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "noAccess");
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
                    delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

                    throw new BpmnError("responseTimeOut");
                }
            }

            return Optional.empty();
        } catch (IOException e) {
            log.error("Ошибка ввода-вывода при запросе прав проекта с ID {}: {}", projectId, e.getMessage(), e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        } catch (Exception e) {
            log.error("Ошибка парсинга ответа при запросе прав проекта с ID {}: {}", projectId, e.getMessage(), e);

            return Optional.empty();
        }
    }
}
