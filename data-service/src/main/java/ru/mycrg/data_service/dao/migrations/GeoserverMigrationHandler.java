package ru.mycrg.data_service.dao.migrations;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;

@Service
public class GeoserverMigrationHandler {

    private static final Logger log = LoggerFactory.getLogger(GeoserverMigrationHandler.class);

    private final Environment environment;
    private final DatasourceFactory datasourceFactory;

    public GeoserverMigrationHandler(DatasourceFactory datasourceFactory,
                                     Environment environment) {
        this.environment = environment;
        this.datasourceFactory = datasourceFactory;
    }

    public void handle() {
        String dbUser = environment.getRequiredProperty("spring.datasource.username");
        String dbName = environment.getRequiredProperty("crg-options.geoserverDbName");

        String adminGeoserver = environment.getRequiredProperty("crg-options.jwt.client_id");
        String systemAdminLogin = environment.getRequiredProperty("crg-options.system-admin-login");
        String systemAdminCryptedPassword = environment.getRequiredProperty(
                "crg-options.system-admin-crypted-password");

        HikariDataSource tempDataSource = datasourceFactory.getNotPoolableDataSource(dbName, "public");

        try {
            log.debug("Initialize geoserver tables");

            JdbcTemplate jdbcTemplate = new JdbcTemplate(tempDataSource);

            String groupRoles = "CREATE TABLE IF NOT EXISTS public.group_roles " +
                    "(groupname character varying(128) NOT NULL," +
                    " rolename  character varying(64)  NOT NULL," +
                    " CONSTRAINT group_roles_pkey PRIMARY KEY (groupname, rolename)" +
                    ") TABLESPACE pg_default; ALTER TABLE public.group_roles OWNER to " + dbUser;

            String roleGroups = "CREATE TABLE IF NOT EXISTS public.role_props" +
                    "(rolename character varying(64) NOT NULL," +
                    " propname character varying(64) NOT NULL," +
                    " propvalue character varying(2048)," +
                    " CONSTRAINT role_props_pkey PRIMARY KEY (rolename, propname)" +
                    ") TABLESPACE pg_default; ALTER TABLE public.role_props OWNER to " + dbUser;

            String roles = "CREATE TABLE IF NOT EXISTS public.roles" +
                    "(name character varying(64) NOT NULL," +
                    " parent character varying(64)," +
                    " CONSTRAINT roles_pkey PRIMARY KEY (name)" +
                    ") TABLESPACE pg_default; ALTER TABLE public.roles OWNER to " + dbUser;

            String userRoles = "CREATE TABLE IF NOT EXISTS public.user_roles" +
                    "(username character varying(128) NOT NULL," +
                    " rolename character varying(64) NOT NULL," +
                    " CONSTRAINT user_roles_pkey PRIMARY KEY (username, rolename)" +
                    ") TABLESPACE pg_default; ALTER TABLE public.user_roles OWNER to " + dbUser;

            String users = "CREATE TABLE IF NOT EXISTS public.users" +
                    "(name character varying(128) NOT NULL," +
                    " password character varying(254)," +
                    " enabled character(1) NOT NULL," +
                    " CONSTRAINT users_pkey PRIMARY KEY (name)" +
                    ") TABLESPACE pg_default; ALTER TABLE public.users OWNER to " + dbUser;

            String usersProps = "CREATE TABLE IF NOT EXISTS public.user_props" +
                    "(username character varying(128) NOT NULL," +
                    " propname character varying(64) NOT NULL," +
                    " propvalue character varying(2048)," +
                    " CONSTRAINT user_props_pkey PRIMARY KEY (username, propname)" +
                    ") TABLESPACE pg_default; ALTER TABLE public.user_props OWNER to " + dbUser;

            String groups = "CREATE TABLE IF NOT EXISTS public.groups" +
                    "(name character varying(128) NOT NULL," +
                    " enabled character(1) NOT NULL," +
                    " CONSTRAINT groups_pkey PRIMARY KEY (name)" +
                    ") TABLESPACE pg_default; ALTER TABLE public.groups OWNER to " + dbUser;

            String groupMembers = "CREATE TABLE IF NOT EXISTS public.group_members" +
                    "(groupname character varying(128) NOT NULL," +
                    " username character varying(128) NOT NULL," +
                    " CONSTRAINT group_members_pkey PRIMARY KEY (groupname, username)" +
                    ") TABLESPACE pg_default; ALTER TABLE public.group_members OWNER to " + dbUser;

            // Tables
            jdbcTemplate.execute(groupRoles);
            jdbcTemplate.execute(roleGroups);
            jdbcTemplate.execute(roles);
            jdbcTemplate.execute(userRoles);
            jdbcTemplate.execute(users);
            jdbcTemplate.execute(usersProps);
            jdbcTemplate.execute(groups);
            jdbcTemplate.execute(groupMembers);

            // Data
            String adminGeoserverAddCryptPass = "INSERT INTO public.users(name, password, enabled) " +
                    "VALUES ('" + adminGeoserver + "', '" + systemAdminCryptedPassword + "', 'Y') " +
                    "ON CONFLICT DO NOTHING";
            log.debug("Execute sql for add adminGeoserver pass [{}]", adminGeoserverAddCryptPass);
            jdbcTemplate.execute(adminGeoserverAddCryptPass);

            String systemAdminAddCryptPass = "INSERT INTO public.users(name, password, enabled) " +
                    "VALUES ('" + systemAdminLogin + "', '" + systemAdminCryptedPassword + "', 'Y') " +
                    "ON CONFLICT DO NOTHING";
            log.debug("Execute sql for add systemAdmin pass [{}]", systemAdminAddCryptPass);
            jdbcTemplate.execute(systemAdminAddCryptPass);

            jdbcTemplate.execute("INSERT INTO public.roles(name) VALUES ('_ADMIN_') ON CONFLICT DO NOTHING");

            String adminGeoserverAddPrivilege = "INSERT INTO public.user_roles(username, rolename) " +
                    "VALUES ('" + adminGeoserver + "', '_ADMIN_') ON CONFLICT DO NOTHING";
            log.debug("Execute sql for add privileges to adminGeoserver [{}]", adminGeoserverAddPrivilege);
            jdbcTemplate.execute(adminGeoserverAddPrivilege);

            String systemAdminAddPrivilege = "INSERT INTO public.user_roles(username, rolename) " +
                    "VALUES ('" + systemAdminLogin + "', '_ADMIN_') ON CONFLICT DO NOTHING";
            log.debug("Execute sql for add privileges to systemAdmin [{}]", systemAdminAddPrivilege);
            jdbcTemplate.execute(systemAdminAddPrivilege);
        } catch (DataAccessException e) {
            log.error("Error handle migrations: {}", e.getMessage());
        } finally {
            tempDataSource.close();
        }
    }
}
