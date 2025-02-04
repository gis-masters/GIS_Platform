package ru.mycrg.data_service.service.cqrs.specialization.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.security.util.InMemoryResource;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.specialization.TableContentModel;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.exceptions.CrgPSqlException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.specialization.SpecializationManager;
import ru.mycrg.data_service.service.cqrs.specialization.requests.InitSpecializationRequest;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.nio.file.Files;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.util.ErrorDetailsExtractor.extractDetails;

@Component
public class InitSpecializationRequestHandler implements IRequestHandler<InitSpecializationRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(InitSpecializationRequestHandler.class);

    private final DatasourceFactory datasourceFactory;
    private final SpecializationManager specializationManager;
    private final IAuthenticationFacade authenticationFacade;

    public InitSpecializationRequestHandler(DatasourceFactory datasourceFactory,
                                            SpecializationManager specializationManager,
                                            IAuthenticationFacade authenticationFacade) {
        this.datasourceFactory = datasourceFactory;
        this.specializationManager = specializationManager;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(InitSpecializationRequest request) {
        Integer specializationId = request.getSpecializationId();
        TableContentModel tableContentModel = request.getTableContentModel();
        List<String> content = tableContentModel.getContent();

        String dbName = getDefaultDatabaseName(authenticationFacade.getOrganizationId());
        try (Connection connection = datasourceFactory.getNotPoolableSystemDataSource(dbName).getConnection()) {
            new ArrayList<>(specializationManager.getFiles(specializationId))
                    .stream()
                    .filter(pathToScript -> content.contains(pathToScript.getFileName().toString()))
                    .forEach(pathToScript -> {
                        try {
                            log.info("Специализация: {}. Выполнять скрипт: {}", specializationId, pathToScript);

                            String scriptContent = Files.readString(pathToScript);

                            Map<String, String> params = tableContentModel.getVariables();
                            params.put("CRG_TABLE_TEMPLATE",
                                       tableContentModel.getDatasetIdentifier() + "." + tableContentModel.getTableIdentifier());
                            params.put("CRG_OWNER_TEMPLATE", "'" + authenticationFacade.getLogin() + "'");

                            log.info("Подменяем шаблоны присланными значениями: {}", params);
                            for (Map.Entry<String, String> entry: params.entrySet()) {
                                String placeholder = entry.getKey();
                                String replacement = entry.getValue();
                                scriptContent = scriptContent.replace(placeholder, replacement);
                            }

                            ScriptUtils.executeSqlScript(connection, new InMemoryResource(scriptContent));
                        } catch (Exception e) {
                            String msg = String.format("Не удалось выполнить скрипт: '%s'", pathToScript.getFileName());
                            log.error("{} => {}", msg, e.getMessage());

                            throw new CrgPSqlException(msg, extractDetails(e));
                        }
                    });
        } catch (CrgPSqlException e) {
            String msg = String.format("Не удалось развернуть специализацию: '%d' => %s",
                                       specializationId, e.getMessage());
            log.error(msg, e);

            throw new DataServiceException(msg, e.getDetails());
        } catch (Exception e) {
            String msg = String.format("Не удалось развернуть специализацию: '%d'", specializationId);
            log.error(msg, e);

            throw new DataServiceException(msg);
        }

        return new Voidy();
    }
}
