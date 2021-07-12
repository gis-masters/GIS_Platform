package ru.mycrg.data_service.service.resources;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.SYSTEM_SCHEMA_NAME;

public class SchemasAndTablesBase {

    public static final ResourceQualifier schemasAndTablesQualifier =
            new ResourceQualifier(SYSTEM_SCHEMA_NAME, "schemas_and_tables");
}
