package ru.mycrg.integration_service.bpmn.org_deletion;

import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service
public class DeleteDbDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(DeleteDbDelegate.class);

    private final BaseHttpService baseHttpService;

    public DeleteDbDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Object orgId = execution.getVariable(ORG_ID_VAR_NAME);
        Object accessToken = execution.getVariable(TOKEN_VAR_NAME);

        String dbName = getDefaultDatabaseName(orgId.toString());
        Request request = new Request.Builder()
                .url(new URL(baseHttpService.getDataServiceUrl(), "/databases/" + dbName))
                .addHeader("Authorization", "Bearer " + accessToken)
                .delete()
                .build();

        Response response = httpClient.newCall(request).execute();
        if (response.isSuccessful()) {
            log.info("БД: {} успешно удалена", dbName);
            execution.setVariable(IS_DELETED_VAR_NAME, true);
        } else {
            log.warn("Удаление БД проекта: {}, потерпело неудачу", dbName);
            execution.setVariable(IS_DELETED_VAR_NAME, false);
        }

        response.close();
    }
}
