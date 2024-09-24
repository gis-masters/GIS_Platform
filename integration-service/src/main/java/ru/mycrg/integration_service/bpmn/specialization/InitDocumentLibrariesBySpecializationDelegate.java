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
import ru.mycrg.common_contracts.specialization.DocumentLibrary;
import ru.mycrg.common_contracts.specialization.Specialization;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.service.SpecializationManager;

import java.net.URL;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.ITERATION_COUNTER_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service("initDocumentLibrariesBySpecializationDelegate")
public class InitDocumentLibrariesBySpecializationDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(InitDocumentLibrariesBySpecializationDelegate.class);

    private final BaseHttpService baseHttpService;
    private final SpecializationManager specializationManager;

    public InitDocumentLibrariesBySpecializationDelegate(BaseHttpService baseHttpService,
                                                         SpecializationManager specializationManager) {
        this.baseHttpService = baseHttpService;
        this.specializationManager = specializationManager;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        int currentIteration = (int) getVariable(execution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        log.error("Создание библиотек документов согласно специализации, осталось попыток: [{}]", currentIteration);

        try {
            OrganizationInitializedEvent event = objectMapper.readValue(
                    (String) getVariable(execution, EVENT_VAR_NAME, getClass().getName()),
                    OrganizationInitializedEvent.class);

            Specialization specialization = specializationManager.getSpecialization(event.getSpecializationId());
            specialization.getDocumentLibraries()
                          .forEach(dl -> createDocumentLibrary(dl, event.getOwnerToken()));

            log.info("Создание библиотек документов согласно специализации: '{}', успешно выполнена",
                     specialization.getId());
            execution.setVariable(ITERATION_COUNTER_VAR_NAME, 3);
        } catch (Exception e) {
            if (currentIteration < 1) {
                log.error("Создание библиотек согласно специализации потерпело неудачу => {}", e.getMessage(), e);

                throw new BpmnError("initDocumentLibrariesFailed");
            } else {
                execution.setVariable(ITERATION_COUNTER_VAR_NAME, --currentIteration);
                log.error("Создание библиотек согласно специализации потерпело неудачу => [{}] Попробуем еще раз.",
                          e.getMessage(), e);

                throw new BpmnError("initDocumentLibrariesFailedTryOneMore");
            }
        }
    }

    private void createDocumentLibrary(DocumentLibrary documentLibrary, String token) {
        Response response = null;
        try {
            Request request = new Request.Builder()
                    .url(new URL(baseHttpService.getDataServiceUrl(), "/document-libraries"))
                    .addHeader("Authorization", "Bearer " + token)
                    .post(RequestBody.create(JSON_MEDIA_TYPE,
                                             "{\"schemaId\": \"" + documentLibrary.getSchemaId() + "\"}"))
                    .build();

            response = httpClient.newCall(request).execute();
            if (!response.isSuccessful() && response.code() != 409) {
                log.warn("Не удалось создать библиотеку документов: '{}'", documentLibrary.getSchemaId());

                throw new IllegalStateException();
            }
        } catch (Exception e) {
            throw new IllegalStateException("Не удалось создать библиотеку документов => " + e.getMessage(), e);
        } finally {
            if (response != null) {
                response.close();
            }
        }
    }
}
