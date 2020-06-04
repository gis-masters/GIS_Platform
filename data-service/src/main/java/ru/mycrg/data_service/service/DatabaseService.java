package ru.mycrg.data_service.service;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.CrgMigrationHandler;
import ru.mycrg.data_service.dao.DatabaseDDL;

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
        databaseDDL.create(dbName);

        migrationHandler.initMigration(dbName);
    }
}
