package ru.mycrg.data_service.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.WorkImport;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.oauth_client.OAuthClient;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Service
public class ImportService {

    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    private final Environment environment;
    private final ISchemaTemplateService schemaService;
    private final IMessageBusProducer messageBus;
    private final ProcessService processService;
    private final IAuthenticationFacade authenticationFacade;

    public ImportService(IMessageBusProducer messageBus,
                         Environment environment,
                         @Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
                         ProcessService processService,
                         IAuthenticationFacade authenticationFacade) {
        this.messageBus = messageBus;
        this.environment = environment;
        this.schemaService = schemaService;
        this.processService = processService;
        this.authenticationFacade = authenticationFacade;
    }

    public Process initProcess(long projectId, String datasetName, WorkImport workImport) {
        long orgId = authenticationFacade.getOrganizationId();
        String dbName = getDefaultDatabaseName(orgId);

        final String title = String.format("Импорт %d слоя(ёв) в dataset: %s",
                                           workImport.getImportTasks().size(), datasetName);
        Process process = processService.create(authenticationFacade.getLogin(), title, IMPORT, workImport.getWsUiId());

        List<ImportMqTask> importMqRequest = new ArrayList<>();
        workImport.getImportTasks().forEach(uiTask -> {
            String workTableName = uiTask.getWorkTableName().toLowerCase();

            SchemaDto schemaDto = new SchemaDto();
            Optional<SchemaDto> oDescription = schemaService.getSchemaByName(uiTask.getSchemaName());
            if (oDescription.isPresent()) {
                schemaDto = oDescription.get();

                log.debug("Import by schema: {}", schemaDto.getName());
            } else {
                schemaDto.setName(workTableName);
                schemaDto.setTableName(workTableName);

                log.debug("Import AsIs, workTableName: {}", workTableName);
            }

            String layerName = String.format("%s_%d_%s", schemaDto.getName(), projectId,
                                             UUID.randomUUID().toString().substring(0, 4));

            ImportMqTask importMqTask = new ImportMqTask(
                    layerName,
                    (schemaDto.getStyleName() != null) ? schemaDto.getStyleName() : schemaDto.getName(),
                    getScratchWorkspaceName(orgId),
                    projectId,
                    schemaDto,
                    new ResourceProjection(dbName, "public", uiTask.getLayerName()),
                    new ResourceProjection(dbName, datasetName, layerName, schemaDto),
                    uiTask.getPairs(),
                    uiTask.getSrs(),
                    getRootAccessToken(),
                    authenticationFacade.getAccessToken()
            );

            importMqRequest.add(importMqTask);
        });

        messageBus.produce(new ImportRequestEvent(process.getId(), dbName, importMqRequest));

        return process;
    }

    private String getRootAccessToken() {
        try {
            String authServiceUrl = environment.getRequiredProperty("crg-options.auth-service-url");
            String clientId = environment.getRequiredProperty("crg-options.jwt.client_id");
            String clientSecret = environment.getRequiredProperty("crg-options.jwt.client_secret");
            String systemAdminLogin = environment.getRequiredProperty("crg-options.system-admin-login");
            String systemAdminPassword = environment.getRequiredProperty("crg-options.system-admin-password");

            return OAuthClient.builder()
                              .url(new URL(authServiceUrl))
                              .clientId(clientId)
                              .clientSecret(clientSecret)
                              .build()
                              .getToken(systemAdminLogin, systemAdminPassword)
                              .getAccess_token();
        } catch (Exception e) {
            throw new DataServiceException("Error get root token");
        }
    }
}
