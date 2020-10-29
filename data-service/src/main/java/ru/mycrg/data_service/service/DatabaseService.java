package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.CrgMigrationHandler;
import ru.mycrg.data_service.dao.DatabaseDDL;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.DEFAULT_DB_NAME;
import static ru.mycrg.data_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.data_service.security.CrgClaimsParser.isRoot;

@Service
public class DatabaseService {

    private final DatabaseDDL databaseDDL;
    private final CrgMigrationHandler migrationHandler;

    public DatabaseService(DatabaseDDL databaseDDL,
                           CrgMigrationHandler migrationHandler) {
        this.databaseDDL = databaseDDL;
        this.migrationHandler = migrationHandler;
    }

    public void create(final String dbName) {
        if (databaseDDL.isDatabaseExist(dbName)) {
            throw new ConflictException("The database "+ dbName + " already exist");
        }

        databaseDDL.create(dbName);

        migrationHandler.initMigration(dbName);
    }

    public void delete(String dbName, Authentication authentication) {
        if (!databaseDDL.isDatabaseExist(dbName)) {
            throw new NotFoundException(dbName);
        }

        if (isRoot(authentication)) {
            databaseDDL.delete(dbName);
        } else {
            Long orgId = getOrganizationId(authentication);
            String calcName = DEFAULT_DB_NAME + orgId;

            if (calcName.equalsIgnoreCase(dbName)) {
                databaseDDL.delete(dbName);
            } else {
                throw new ForbiddenException("Not allowed");
            }
        }
    }

    public boolean isExist(@NotNull String dbName, Authentication authentication) {
        if (isRoot(authentication)) {
            return databaseDDL.isDatabaseExist(dbName);
        }

        if (getIdFromDbName(dbName) == getOrganizationId(authentication)) {
            return databaseDDL.isDatabaseExist(dbName);
        } else {
            throw new ForbiddenException("Not allowed");
        }
    }

    private int getIdFromDbName(String dbName) {
        try {
            final String postfix = dbName.split("_")[1];

            return Integer.parseInt(postfix);
        } catch (Exception e) {
            throw new BadRequestException("Invalid db name: " + dbName);
        }
    }
}
