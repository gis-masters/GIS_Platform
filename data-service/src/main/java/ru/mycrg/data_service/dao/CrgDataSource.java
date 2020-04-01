package ru.mycrg.data_service.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.core.env.Environment;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import java.io.PrintWriter;
import java.net.URI;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Logger;

import static ru.mycrg.data_service.security.CrgClaimsParser.getOrganizationId;

/**
 * Наш декоратор над DataSource.
 * В нем мы подменяем базу данных исходя из инфы в токене пользователя.
 */
public class CrgDataSource implements DataSource {

    public static final String DATA_SCHEMA_NAME = "data";
    public static final String DEFAULT_DB_NAME = "database_";

    private final Map<String, HikariDataSource> dataSources = new HashMap<>();

    private final DataSource dataSource;
    private final Environment environment;
    private final HttpServletRequest httpServletRequest;

    public CrgDataSource(DataSource dataSource, Environment environment, HttpServletRequest httpServletRequest) {
        this.dataSource = dataSource;
        this.environment = environment;
        this.httpServletRequest = httpServletRequest;
    }

    @Override
    public Connection getConnection() throws SQLException {
        Long orgId = getOrganizationId(httpServletRequest.getUserPrincipal());
        String dbName = DEFAULT_DB_NAME + orgId;

        if (dataSources.containsKey(dbName)) {
            return dataSources.get(dbName).getConnection();
        } else {
            HikariDataSource newDataSource = new HikariDataSource();
            newDataSource.setJdbcUrl(getConnectionUrl(dbName));
            newDataSource.setSchema(DATA_SCHEMA_NAME);
            newDataSource.setUsername(environment.getProperty("spring.datasource.username"));
            newDataSource.setPassword(environment.getProperty("spring.datasource.password"));
            newDataSource.setMaximumPoolSize(3);

            dataSources.put(dbName, newDataSource);

            return newDataSource.getConnection();
        }
    }

    @Override
    public Connection getConnection(String username, String password) throws SQLException {
        return dataSource.getConnection(username, password);
    }

    @Override
    public PrintWriter getLogWriter() throws SQLException {
        return dataSource.getLogWriter();
    }

    @Override
    public void setLogWriter(PrintWriter out) throws SQLException {
        dataSource.setLogWriter(out);
    }

    @Override
    public void setLoginTimeout(int seconds) throws SQLException {
        dataSource.setLoginTimeout(seconds);
    }

    @Override
    public int getLoginTimeout() throws SQLException {
        return dataSource.getLoginTimeout();
    }

    @Override
    public Logger getParentLogger() throws SQLFeatureNotSupportedException {
        return dataSource.getParentLogger();
    }

    @Override
    public <T> T unwrap(Class<T> iface) throws SQLException {
        return dataSource.unwrap(iface);
    }

    @Override
    public boolean isWrapperFor(Class<?> iface) throws SQLException {
        return dataSource.isWrapperFor(iface);
    }

    public String getConnectionUrl(String dbName) {
        String envUri = Objects.requireNonNull(environment.getProperty("spring.datasource.url"));
        String source = "jdbc:";

        URI defaultUri = URI.create(envUri.substring(source.length()));

        return source +
                defaultUri.getScheme() + "://" +
                defaultUri.getHost() + ":" + defaultUri.getPort() +
                "/" + dbName;
    }

}
