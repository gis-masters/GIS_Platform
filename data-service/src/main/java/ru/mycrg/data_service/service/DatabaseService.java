package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.migrations.CrgMigrationHandler;
import ru.mycrg.data_service.dao.ddl.DdlDatabase;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;

import java.util.Objects;

import static ru.mycrg.common_utils.CrgGlobalProperties.extractIdFromDbName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;

@Service
public class DatabaseService {

    private final DdlDatabase ddlDatabase;
    private final CrgMigrationHandler migrationHandler;
    private final IAuthenticationFacade authenticationFacade;

    public DatabaseService(DdlDatabase ddlDatabase,
                           CrgMigrationHandler migrationHandler,
                           IAuthenticationFacade authenticationFacade) {
        this.ddlDatabase = ddlDatabase;
        this.migrationHandler = migrationHandler;
        this.authenticationFacade = authenticationFacade;
    }

    public void create(final String dbName) {
        if (ddlDatabase.isExist(dbName)) {
            throw new ConflictException("The database "+ dbName + " already exist");
        }

        ddlDatabase.create(dbName);

        migrationHandler.initMigration(dbName);
    }

    public void delete(String dbName) {
        if (!ddlDatabase.isExist(dbName)) {
            throw new NotFoundException(dbName);
        }

        if (authenticationFacade.isRoot()) {
            ddlDatabase.drop(dbName);
        } else {
            Long orgId = authenticationFacade.getOrganizationId();
            String calcName = getDefaultDatabaseName(orgId);

            if (calcName.equalsIgnoreCase(dbName)) {
                ddlDatabase.drop(dbName);
            } else {
                throw new ForbiddenException("Недостаточно прав для удаления бд: " + dbName);
            }
        }
    }

    public boolean isExist(@NotNull String dbName) {
        if (authenticationFacade.isRoot()) {
            return ddlDatabase.isExist(dbName);
        }

        Long dbId = extractIdFromDbName(dbName)
                .orElseThrow(() -> new BadRequestException("Invalid db name: " + dbName));

        if (Objects.equals(dbId, authenticationFacade.getOrganizationId())) {
            return ddlDatabase.isExist(dbName);
        } else {
            throw new ForbiddenException("Недостаточно прав для просмотра");
        }
    }
}
