package ru.mycrg.data_service.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.WorkImport;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.TransformationException;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.ProcessService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.parsers.XmlParser;
import ru.mycrg.data_service.service.parsers.exceptions.XmlParserException;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.oauth_client.OAuthClient;

import java.net.URL;
import java.util.*;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Service
public class ImportService {

    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    private final Environment environment;
    private final SchemaService schemaService;
    private final IMessageBusProducer messageBus;
    private final ProcessService processService;
    private final IAuthenticationFacade authenticationFacade;
    private final TablesDao tablesDao;
    private final XmlParser xmlParser;

    public ImportService(IMessageBusProducer messageBus,
                         Environment environment,
                         SchemaService schemaService,
                         ProcessService processService,
                         IAuthenticationFacade authenticationFacade,
                         TablesDao tablesDao,
                         XmlParser xmlParser) {
        this.messageBus = messageBus;
        this.environment = environment;
        this.schemaService = schemaService;
        this.processService = processService;
        this.authenticationFacade = authenticationFacade;
        this.tablesDao = tablesDao;
        this.xmlParser = xmlParser;
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
                    schemaDto.getName(),
                    "scratch_database_" + orgId,
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

    public void importXmlToDB(MultipartFile file, SchemaDto schemaDto, ResourceIdentifier rIdentifier, Integer srid) {

        try {
            Map<String, Object> dataForSavingToDB = xmlParser.parseByScheme(file, schemaDto, srid);
            tablesDao.addRecord(rIdentifier, dataForSavingToDB);
        } catch (CrgDaoException e) {
            log.error(e.getMessage());
            throw new DataServiceException("Failed to add new record to " + rIdentifier);
        } catch (XmlParserException e) {
            throw new DataServiceException(e.getMessage());
        } catch (TransformationException e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    private String getRootAccessToken() {
        try {
            String authServiceUrl = environment.getRequiredProperty("crg-options.auth-service-url");
            String clientId = environment.getRequiredProperty("crg-options.client_id");
            String clientSecret = environment.getRequiredProperty("crg-options.client_secret");
            String rootUserName = environment.getRequiredProperty("crg-options.root-user-name");
            String rootUserPass = environment.getRequiredProperty("crg-options.root-user-password");

            return OAuthClient.builder()
                              .url(new URL(authServiceUrl))
                              .clientId(clientId)
                              .clientSecret(clientSecret)
                              .build()
                              .getToken(rootUserName, rootUserPass)
                              .getAccess_token();
        } catch (Exception e) {
            throw new DataServiceException("Error get root token");
        }
    }
}
