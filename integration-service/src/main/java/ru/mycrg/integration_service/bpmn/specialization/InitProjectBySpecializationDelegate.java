package ru.mycrg.integration_service.bpmn.specialization;

import com.fasterxml.jackson.core.type.TypeReference;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectCreateDto;
import ru.mycrg.common_contracts.specialization.Project;
import ru.mycrg.common_contracts.specialization.Specialization;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.dto.SpecializationLayerPublicationModel;
import ru.mycrg.integration_service.service.SpecializationManager;

import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.fromJson;
import static ru.mycrg.http_client.JsonConverter.toJson;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service("initProjectBySpecializationDelegate")
public class InitProjectBySpecializationDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(InitProjectBySpecializationDelegate.class);

    private final BaseHttpService baseHttpService;
    private final SpecializationManager specializationManager;

    public InitProjectBySpecializationDelegate(BaseHttpService baseHttpService,
                                               SpecializationManager specializationManager) {
        this.baseHttpService = baseHttpService;
        this.specializationManager = specializationManager;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        int currentIteration = (int) getVariable(execution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        log.error("Создание проекта согласно специализации, осталось попыток: [{}]", currentIteration);

        try {
            OrganizationInitializedEvent event = objectMapper.readValue(
                    getVariable(execution, EVENT_VAR_NAME, getClass().getName()).toString(),
                    OrganizationInitializedEvent.class);

            List<SpecializationLayerPublicationModel> publicationModels = objectMapper.readValue(
                    getVariable(execution, SPECIALIZATION_LAYERS_FOR_PUBLICATION, getClass().getName()).toString(),
                    new TypeReference<List<SpecializationLayerPublicationModel>>() {
                    });

            Specialization specialization = specializationManager.getSpecialization(event.getSpecializationId());
            specialization.getProjects()
                          .forEach(project -> {
                              String projectId = createProject(project, event.getOwnerToken());

                              log.debug("Создан проект: '{}' Слои: {}", projectId, project.getLayers());

                              project.getLayers().forEach(layerId -> {
                                  publicationModels
                                          .stream()
                                          .filter(item -> item.getId().equals(layerId))
                                          .findFirst()
                                          .ifPresent(publicationModel -> {
                                              createLayer(publicationModel, projectId, event.getOwnerToken());
                                          });
                              });
                          });

            log.info("Создание проекта согласно специализации: '{}', успешно выполнена",
                     specialization.getId());
            execution.setVariable(ITERATION_COUNTER_VAR_NAME, 3);
        } catch (Exception e) {
            if (currentIteration < 1) {
                log.error("Создание проекта согласно специализации потерпело неудачу => {}", e.getMessage(), e);

                throw new BpmnError("initProjectFailed");
            } else {
                execution.setVariable(ITERATION_COUNTER_VAR_NAME, --currentIteration);
                log.error("Создание проекта согласно специализации потерпело неудачу => [{}] Попробуем еще раз.",
                          e.getMessage(), e);

                throw new BpmnError("initProjectFailedTryOneMore");
            }
        }
    }

    private String createProject(Project project, String token) {
        Response response = null;

        String payload = toJson(new ProjectCreateDto(project.getTitle(), project.getDescription(), project.getBbox(),
                                                     project.getIsDefault() != null && project.getIsDefault()));

        try {
            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getGisServiceUrl(), "/projects"))
                    .addHeader("Authorization", "Bearer " + token)
                    .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                    .build();

            response = httpClient.newCall(request).execute();
            if (!response.isSuccessful() && response.code() != 409) {
                log.warn("Не удалось создать проект: '{}'", project.getTitle());

                throw new IllegalStateException();
            } else {
                try {
                    String bodyAsJson = response.body().string();
                    Optional<HashMap> result = fromJson(bodyAsJson, HashMap.class);

                    return result.get().get("id").toString();
                } catch (Exception e) {
                    log.warn("Не удалось получить идентификатор созданного слоя");

                    throw new IllegalStateException();
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException("Не удалось создать проект => " + e.getMessage(), e);
        } finally {
            if (response != null) {
                response.close();
            }
        }
    }

    private void createLayer(SpecializationLayerPublicationModel publicationModel,
                             String projectId,
                             String token) {
        Response response = null;
        try {
            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getGisServiceUrl(), "/projects/" + projectId + "/layers"))
                    .addHeader("Authorization", "Bearer " + token)
                    .post(RequestBody.create(JSON_MEDIA_TYPE, objectMapper.writeValueAsString(publicationModel)))
                    .build();

            response = httpClient.newCall(request).execute();
            if (!response.isSuccessful()) {
                log.warn("Не удалось создать слой в проекте: '{}'", publicationModel);

                throw new IllegalStateException();
            }
        } catch (Exception e) {
            throw new IllegalStateException("Не удалось создать слой => " + e.getMessage(), e);
        } finally {
            if (response != null) {
                response.close();
            }
        }
    }
}
