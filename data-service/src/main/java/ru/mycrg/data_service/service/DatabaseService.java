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

import java.util.Objects;

import static ru.mycrg.common_utils.CrgGlobalProperties.extractIdFromDbName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
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
            String calcName = getDefaultDatabaseName(orgId);

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

        Long dbId = extractIdFromDbName(dbName)
                .orElseThrow(() -> new BadRequestException("Invalid db name: " + dbName));

        if (Objects.equals(dbId, getOrganizationId(authentication))) {
            return databaseDDL.isDatabaseExist(dbName);
        } else {
            throw new ForbiddenException("Not allowed");
        }
    }
}
