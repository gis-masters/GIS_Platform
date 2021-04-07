package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.CrgMigrationHandler;
import ru.mycrg.data_service.dao.DatabaseDDL;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.IAuthenticationFacade;

import java.util.Objects;

import static ru.mycrg.common_utils.CrgGlobalProperties.extractIdFromDbName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;

@Service
public class DatabaseService {

    private final DatabaseDDL databaseDDL;
    private final CrgMigrationHandler migrationHandler;
    private final IAuthenticationFacade authenticationFacade;

    public DatabaseService(DatabaseDDL databaseDDL,
                           CrgMigrationHandler migrationHandler,
                           IAuthenticationFacade authenticationFacade) {
        this.databaseDDL = databaseDDL;
        this.migrationHandler = migrationHandler;
        this.authenticationFacade = authenticationFacade;
    }

    public void create(final String dbName) {
        if (databaseDDL.isDatabaseExist(dbName)) {
            throw new ConflictException("The database "+ dbName + " already exist");
        }

        databaseDDL.create(dbName);

        migrationHandler.initMigration(dbName);
    }

    public void delete(String dbName) {
        if (!databaseDDL.isDatabaseExist(dbName)) {
            throw new NotFoundException(dbName);
        }

        if (authenticationFacade.isRoot()) {
            databaseDDL.delete(dbName);
        } else {
            Long orgId = authenticationFacade.getOrganizationId();
            String calcName = getDefaultDatabaseName(orgId);

            if (calcName.equalsIgnoreCase(dbName)) {
                databaseDDL.delete(dbName);
            } else {
                throw new ForbiddenException("Not allowed");
            }
        }
    }

    public boolean isExist(@NotNull String dbName) {
        if (authenticationFacade.isRoot()) {
            return databaseDDL.isDatabaseExist(dbName);
        }

        Long dbId = extractIdFromDbName(dbName)
                .orElseThrow(() -> new BadRequestException("Invalid db name: " + dbName));

        if (Objects.equals(dbId, authenticationFacade.getOrganizationId())) {
            return databaseDDL.isDatabaseExist(dbName);
        } else {
            throw new ForbiddenException("Not allowed");
        }
    }
}
