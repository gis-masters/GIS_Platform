package ru.mycrg.data_service.service.cqrs.specialization.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.exceptions.CrgPSqlException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.specialization.SpecializationManager;
import ru.mycrg.data_service.service.cqrs.specialization.requests.InitSpecializationRequest;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.nio.file.Path;
import java.sql.Connection;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.util.ErrorDetailsExtractor.extractDetails;

@Component
public class InitSpecializationRequestHandler implements IRequestHandler<InitSpecializationRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(InitSpecializationRequestHandler.class);

    private final DatasourceFactory datasourceFactory;
    private final IAuthenticationFacade authenticationFacade;
    private final SpecializationManager specializationManager;

    public InitSpecializationRequestHandler(DatasourceFactory datasourceFactory,
                                            IAuthenticationFacade authenticationFacade,
                                            SpecializationManager specializationManager) {
        this.datasourceFactory = datasourceFactory;
        this.authenticationFacade = authenticationFacade;
        this.specializationManager = specializationManager;
    }

    @Override
    public Voidy handle(InitSpecializationRequest request) {
        Integer specializationId = request.getSpecializationId();
        String dbName = getDefaultDatabaseName(authenticationFacade.getOrganizationId());

        try (Connection connection = datasourceFactory.getNotPoolableSystemDataSource(dbName).getConnection()) {
            List<Path> sortedScripts = specializationManager.getFiles(specializationId)
                                                            .stream()
                                                            .sorted(bySequenceNumber())
                                                            .collect(Collectors.toList());

            log.info("Специализация: {}. Начинаю выполнять скрипты: {}", specializationId, sortedScripts);

            sortedScripts.forEach(pathToScript -> {
                try {
                    ScriptUtils.executeSqlScript(connection, new FileSystemResource(pathToScript.toString()));
                } catch (Exception e) {
                    String msg = String.format("Не удалось выполнить скрипт: '%s'", pathToScript.getFileName());

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

    private static Comparator<Path> bySequenceNumber() {
        return Comparator.comparingInt(path -> {
            String fileName = path.getFileName().toString().toLowerCase();
            String numberAsString = fileName.split("__")[0].replace("v", "");

            return numberAsString.isBlank()
                    ? 0
                    : Integer.parseInt(numberAsString);
        });
    }
}
