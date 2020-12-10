package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.DATA_SCHEMA_NAME;

@Service
public class ServiceTablesInitializer {

    public static final Logger log = LoggerFactory.getLogger(ServiceTablesInitializer.class);

    private final Environment environment;

    public ServiceTablesInitializer(Environment environment) {
        this.environment = environment;
    }

    public void initialize(JdbcTemplate jdbcTemplate) {
        String dbUser = environment.getRequiredProperty("spring.datasource.username");
        String createSchema = "CREATE SCHEMA IF NOT EXISTS " + DATA_SCHEMA_NAME + " AUTHORIZATION " + dbUser;

        String baseMapsTable = "CREATE TABLE IF NOT EXISTS data.base_maps" +
                "(id            bigserial              NOT NULL," +
                " name          character varying(255)," +
                " title         character varying(255) NOT NULL," +
                " thumbnail_urn character varying(255) NOT NULL," +
                " type          character varying(20)  NOT NULL," +
                " url           character varying(255)," +
                " layer_name    character varying(255)," +
                " style         character varying(50)," +
                " projection    character varying(20)," +
                " format        character varying(20)," +
                " size          integer," +
                " resolution    integer," +
                " matrix_ids    integer," +
                " created_at    timestamp without time zone," +
                " last_modified timestamp without time zone," +
                " CONSTRAINT base_maps_pkey PRIMARY KEY (id)" +
                ") TABLESPACE pg_default; ALTER TABLE data.base_maps OWNER to " + dbUser;

        String documentsTable = "CREATE TABLE IF NOT EXISTS data.documents" +
                "(id         uuid NOT NULL," +
                " title      character varying(500) NOT NULL," +
                " size       bigserial," +
                " CONSTRAINT documents_pkey PRIMARY KEY (id)" +
                ") TABLESPACE pg_default; ALTER TABLE data.documents OWNER to " + dbUser;

        String resourceTable = "CREATE TABLE IF NOT EXISTS data.resource" +
                "(id            bigserial                 NOT NULL," +
                " title         character varying         NOT NULL," +
                " details       character varying(1024)," +
                " type          character varying(20)     NOT NULL," +
                " identifier    character varying         NOT NULL," +
                " items_count   integer                   DEFAULT 0," +
                " created_by    character varying," +
                " created_at    timestamp without time zone," +
                " last_modified timestamp without time zone," +
                " CONSTRAINT resource_description_pkey PRIMARY KEY (id)," +
                " CONSTRAINT resource_identifier_type UNIQUE (identifier, type)" +
                ") TABLESPACE pg_default; ALTER TABLE data.resource OWNER to " + dbUser;

        String principalTable = "CREATE TABLE IF NOT EXISTS data.principal " +
                "(id            bigserial               NOT NULL," +
                " identifier    bigint                  NOT NULL," +
                " type          character varying(20)   NOT NULL," +
                " CONSTRAINT principal_pkey PRIMARY KEY (id)," +
                " CONSTRAINT principal_identifier_type UNIQUE (identifier, type)" +
                ") TABLESPACE pg_default; ALTER TABLE data.principal OWNER to " + dbUser;

        String permissionTable = "CREATE TABLE data.permission" +
                "(id            bigserial               NOT NULL," +
                " role          character varying(20)," +
                " principal_id  bigint                  NOT NULL," +
                " resource_id   bigint                  NOT NULL," +
                " created_at    timestamp without time zone," +
                " last_modified timestamp without time zone," +
                " CONSTRAINT permission_pkey PRIMARY KEY (id)," +
                " CONSTRAINT fk3yfc65wpuf6tu7enud5iqkh9b FOREIGN KEY (resource_id)" +
                "     REFERENCES data.resource (id) MATCH SIMPLE" +
                "     ON UPDATE NO ACTION" +
                "     ON DELETE NO ACTION," +
                " CONSTRAINT fkcsq8yuy5497r2s4n8h1rh1a62 FOREIGN KEY (principal_id)" +
                "     REFERENCES data.principal (id) MATCH SIMPLE" +
                "     ON UPDATE NO ACTION" +
                "     ON DELETE NO ACTION" +
                ") TABLESPACE pg_default; ALTER TABLE data.permission OWNER to " + dbUser;

        try {
            jdbcTemplate.execute(createSchema);

            jdbcTemplate.execute(baseMapsTable);
            jdbcTemplate.execute(documentsTable);
            jdbcTemplate.execute(resourceTable);
            jdbcTemplate.execute(principalTable);
            jdbcTemplate.execute(permissionTable);
        } catch (DataAccessException e) {
            log.error("Error generate service tables: {}", e.getMessage());
        }
    }
}
