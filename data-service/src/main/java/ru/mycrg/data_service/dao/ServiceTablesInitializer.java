package ru.mycrg.data_service.dao;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.DATA_SCHEMA_NAME;

@Log4j2
@Service
public class ServiceTablesInitializer {

    @Autowired
    private Environment environment;

    public ServiceTablesInitializer() {
    }

    public void initialize(JdbcTemplate jdbcTemplate) {
        String dbUser = environment.getRequiredProperty("spring.datasource.username");
        String createSchema = "CREATE SCHEMA IF NOT EXISTS " + DATA_SCHEMA_NAME + " AUTHORIZATION " + dbUser;
        String permissionsTable = "CREATE TABLE IF NOT EXISTS data.permissions " +
                "(id             bigserial NOT NULL," +
                " principal_type character varying(50)," +
                " principal_id   bigint," +
                " role           character varying(50)," +
                " created_at     timestamp without time zone," +
                " last_modified  timestamp without time zone," +
                " CONSTRAINT permissions_pkey PRIMARY KEY (id)" +
                ") TABLESPACE pg_default; ALTER TABLE data.permissions OWNER to " + dbUser;

        String resourcesTable = "CREATE TABLE IF NOT EXISTS data.resources" +
                "(id         bigserial NOT NULL," +
                " type       character varying(50)," +
                " identifier character varying(255)," +
                " CONSTRAINT resource_pkey PRIMARY KEY (id)" +
                ") TABLESPACE pg_default; ALTER TABLE data.resources OWNER to " + dbUser;

        String resourcePermissionsTable = "CREATE TABLE IF NOT EXISTS data.resource_permissions" +
                "(" +
                "    permission_id bigserial NOT NULL," +
                "    resource_id   bigserial NOT NULL," +
                "    CONSTRAINT resources_permissions_pkey PRIMARY KEY (resource_id, permission_id)," +
                "    CONSTRAINT fk8abj4or9ii7x4gwy7qb85a4y2 FOREIGN KEY (resource_id)" +
                "        REFERENCES data.resources (id) MATCH SIMPLE" +
                "        ON UPDATE NO ACTION" +
                "        ON DELETE NO ACTION," +
                "    CONSTRAINT fkl26dnu64nki1y3bhb38k4ll8a FOREIGN KEY (permission_id)" +
                "        REFERENCES data.permissions (id) MATCH SIMPLE" +
                "        ON UPDATE NO ACTION" +
                "        ON DELETE NO ACTION" +
                ") TABLESPACE pg_default; ALTER TABLE data.resource_permissions OWNER to " + dbUser;

        String baseMapsTable = "CREATE TABLE IF NOT EXISTS data.base_maps" +
                "(" +
                "    id            bigserial              NOT NULL," +
                "    name          character varying(255)," +
                "    title         character varying(255) NOT NULL," +
                "    thumbnail_urn character varying(255) NOT NULL," +
                "    type          character varying(20)  NOT NULL," +
                "    url           character varying(255)," +
                "    layer_name    character varying(255)," +
                "    style         character varying(50)," +
                "    projection    character varying(20)," +
                "    format        character varying(20)," +
                "    size          integer," +
                "    resolution    integer," +
                "    matrix_ids    integer," +
                "    created_at    timestamp without time zone," +
                "    last_modified timestamp without time zone," +
                "    CONSTRAINT base_maps_pkey PRIMARY KEY (id)" +
                ")" +
                "TABLESPACE pg_default; ALTER TABLE data.base_maps OWNER to " + dbUser;

        try {
            jdbcTemplate.execute(createSchema);

            jdbcTemplate.execute(baseMapsTable);
            jdbcTemplate.execute(permissionsTable);
            jdbcTemplate.execute(resourcesTable);
            jdbcTemplate.execute(resourcePermissionsTable);
        } catch (DataAccessException e) {
            log.error("Error generate service tables: {}", e.getMessage());
        }
    }

}
