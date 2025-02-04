package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.ddl.database.DdlDatabase;
import ru.mycrg.data_service.dao.migrations.CrgMigrationHandler;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;

import java.util.Objects;

import static ru.mycrg.common_utils.CrgGlobalProperties.extractIdFromDbName;

@Service
public class DatabaseService {

    private final DdlDatabase ddlDatabase;
    private final SystemTagsPublisher systemTagsPublisher;
    private final CrgMigrationHandler migrationHandler;
    private final IAuthenticationFacade authenticationFacade;

    public DatabaseService(DdlDatabase ddlDatabase,
                           SystemTagsPublisher systemTagsPublisher,
                           CrgMigrationHandler migrationHandler,
                           IAuthenticationFacade authenticationFacade) {
        this.ddlDatabase = ddlDatabase;
        this.systemTagsPublisher = systemTagsPublisher;
        this.migrationHandler = migrationHandler;
        this.authenticationFacade = authenticationFacade;
    }

    public void create(final String dbName) {
        if (ddlDatabase.isExist(dbName)) {
            throw new ConflictException("The database " + dbName + " already exist");
        }

        ddlDatabase.create(dbName);

        migrationHandler.performInitialMigrations(dbName);
        systemTagsPublisher.publish();
    }

    public void delete(String dbName) {
        if (!ddlDatabase.isExist(dbName)) {
            throw new NotFoundException(dbName);
        }

        if (authenticationFacade.isRoot()) {
            ddlDatabase.drop(dbName);
        } else {
            throw new ForbiddenException("Удаление базы данных доступно только администратору системы.");
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
