package ru.mycrg.integration_service.bpmn.specialization;

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
import ru.mycrg.common_contracts.generated.specialization.TableContentModel;
import ru.mycrg.common_contracts.specialization.Dataset;
import ru.mycrg.common_contracts.specialization.Specialization;
import ru.mycrg.common_contracts.specialization.Table;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.dto.SpecializationLayerPublicationModel;
import ru.mycrg.integration_service.service.SpecializationManager;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.fromJson;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service("initDataServiceSpecializationDelegate")
public class InitDataServiceSpecializationDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(InitDataServiceSpecializationDelegate.class);

    private final BaseHttpService baseHttpService;
    private final SpecializationManager specializationManager;

    public InitDataServiceSpecializationDelegate(BaseHttpService baseHttpService,
                                                 SpecializationManager specializationManager) {
        this.baseHttpService = baseHttpService;
        this.specializationManager = specializationManager;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        int currentIteration = (int) getVariable(execution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        log.error("Инициализация специализации на data-service, осталось попыток: [{}]", currentIteration);

        String ownerToken;
        Integer specializationId;

        //1 - try создаёт наборы данных с таблицами и заполняет их данными
        try {
            OrganizationInitializedEvent event = objectMapper.readValue(
                    (String) getVariable(execution, EVENT_VAR_NAME, getClass().getName()),
                    OrganizationInitializedEvent.class);

            ownerToken = event.getOwnerToken();
            Specialization specialization = specializationManager.getSpecialization(event.getSpecializationId());
            specializationId = specialization.getId();

            List<SpecializationLayerPublicationModel> publicationModels = new ArrayList<>();

            specialization.getDatasets()
                          .forEach(dataset -> {
                              String datasetIdentifier = createDataset(dataset, ownerToken);
                              log.info("Создан набор данных: {}", datasetIdentifier);

                              dataset.getTables()
                                     .forEach(table -> {
                                         String tableIdentifier = establishTable(specialization.getId(),
                                                                                 datasetIdentifier,
                                                                                 table,
                                                                                 ownerToken);

                                         publicationModels.add(
                                                 new SpecializationLayerPublicationModel(table.getId(),
                                                                                         table.getBody().getTitle(),
                                                                                         table.getBody().getCrs(),
                                                                                         table.getBody().getStyleName(),
                                                                                         datasetIdentifier,
                                                                                         tableIdentifier));
                                     });
                          });

            log.info("Инициализация специализации: '{}' на data-service, успешно выполнена", specialization.getId());

            execution.setVariable(ITERATION_COUNTER_VAR_NAME, 3);
            execution.setVariable(SPECIALIZATION_LAYERS_FOR_PUBLICATION, publicationModels);
        } catch (Exception e) {
            if (currentIteration < 1) {
                log.error("Инициализация специализации на data-service потерпело неудачу => {}", e.getMessage(), e);

                throw new BpmnError("initDataServiceSpecializationFailed");
            } else {
                execution.setVariable(ITERATION_COUNTER_VAR_NAME, --currentIteration);
                log.error("Инициализация специализации на data-service потерпело неудачу => [{}] Попробуем еще раз.",
                          e.getMessage(), e);

                throw new BpmnError("initDataServiceSpecializationFailedTryOneMore");
            }
        }

        //2 - try приносит в организацию схемы из папки schemas
        try {
            createSchemas(ownerToken, specializationId);
            log.info("Созданы схемы данных");
        } catch (Exception e) {
            log.error("Не получилось принести кастомные схемы в специализацию => {}", e.getMessage());
            throw new BpmnError("initDataServiceSpecializationFailedTryOneMore");
        }

        //3 - try создаст таблицу задач и привяжет внешний ключ к таблице лога
        try {
            createTaskTable(ownerToken);
            log.info("Создание таблицы задач успешно выполнено");
        } catch (Exception e) {
            log.error("Не получилось создать таблицу задач => {}", e.getMessage());
            throw new BpmnError("initDataServiceSpecializationFailedTryOneMore");
        }
    }

    private void createSchemas(String token, Integer specId) {
        Response response = null;
        try {

            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getDataServiceUrl(), "/specializations/" + specId + "/schemasInit"))
                    .addHeader("Authorization", "Bearer " + token)
                    .post(RequestBody.create(JSON_MEDIA_TYPE, new byte[0]))
                    .build();

            response = httpClient.newCall(request).execute();
            if (!response.isSuccessful()) {
                log.warn("Не удалось принести схемы в специализацию.");

                throw new IllegalStateException();
            }
        } catch (Exception e) {
            throw new IllegalStateException("Не удалось принести схемы в специализацию => " + e.getMessage(), e);
        } finally {
            if (response != null) {
                response.close();
            }
        }
    }

    private String createDataset(Dataset dataset, String token) {
        Response response = null;
        try {
            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getDataServiceUrl(), "/datasets"))
                    .addHeader("Authorization", "Bearer " + token)
                    .post(RequestBody.create(JSON_MEDIA_TYPE, "{\"title\": \"" + dataset.getTitle() + "\"}"))
                    .build();

            response = httpClient.newCall(request).execute();
            if (!response.isSuccessful()) {
                log.warn("Не удалось создать набор данных: '{}'", dataset.getTitle());

                throw new IllegalStateException();
            } else {
                String location = response.header("Location");

                return location.split("/datasets/")[1];
            }
        } catch (Exception e) {
            throw new IllegalStateException("Не удалось создать набор данных => " + e.getMessage(), e);
        } finally {
            if (response != null) {
                response.close();
            }
        }
    }

    private void createTaskTable(String token) {
        Response response = null;
        try {
            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getDataServiceUrl(), "/tasks/crateTable/tasks_schema_v1"))
                    .addHeader("Authorization", "Bearer " + token)
                    .post(RequestBody.create(JSON_MEDIA_TYPE, new byte[0]))
                    .build();

            response = httpClient.newCall(request).execute();
            if (!response.isSuccessful()) {
                log.warn("Не удалось создать таблицу задач по схеме");

                throw new IllegalStateException();
            }
        } catch (Exception e) {
            throw new IllegalStateException("Не удалось создать таблицу задач => " + e.getMessage(), e);
        } finally {
            if (response != null) {
                response.close();
            }
        }
    }

    private String establishTable(Integer specId,
                                  String datasetIdentifier,
                                  Table table,
                                  String token) {
        String tableIdentifier = createTable(datasetIdentifier, table, token);
        createContent(specId, datasetIdentifier, tableIdentifier, table.getContent(), token);

        return tableIdentifier;
    }

    private void createContent(Integer specId,
                               String datasetIdentifier,
                               String tableIdentifier,
                               List<String> content,
                               String token) {
        Response response = null;
        try {
            TableContentModel tableContentModel = new TableContentModel(datasetIdentifier,
                                                                        tableIdentifier,
                                                                        content,
                                                                        new HashMap<>());
            String payload = objectMapper.writeValueAsString(tableContentModel);

            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getDataServiceUrl(), "/specializations/" + specId + "/datasetsInit"))
                    .addHeader("Authorization", "Bearer " + token)
                    .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                    .build();

            response = httpClient.newCall(request).execute();
            if (!response.isSuccessful()) {
                log.warn("Не удалось наполнить таблицу: '{}' контентом", tableIdentifier);

                throw new IllegalStateException();
            }
        } catch (Exception e) {
            throw new IllegalStateException("Не удалось наполнить таблицу контентом => " + e.getMessage(), e);
        } finally {
            if (response != null) {
                response.close();
            }
        }
    }

    private String createTable(String datasetIdentifier, Table table, String token) {
        Response response = null;
        try {
            String payload = objectMapper.writeValueAsString(table.getBody());

            URL url = new URL(baseHttpService.getDataServiceUrl(),
                              String.format("/datasets/%s/tables", datasetIdentifier));

            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("Authorization", "Bearer " + token)
                    .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                    .build();

            response = httpClient.newCall(request).execute();
            if (!response.isSuccessful()) {
                log.warn("Не удалось создать таблицу: '{}'", payload);

                throw new IllegalStateException();
            } else {
                try {
                    String bodyAsJson = response.body().string();
                    Optional<HashMap> result = fromJson(bodyAsJson, HashMap.class);

                    return result.get().get("identifier").toString();
                } catch (Exception e) {
                    log.warn("Не удалось получить идентификатор созданного слоя");

                    throw new IllegalStateException();
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException("Не удалось создать таблицу => " + e.getMessage(), e);
        } finally {
            if (response != null) {
                response.close();
            }
        }
    }
}
