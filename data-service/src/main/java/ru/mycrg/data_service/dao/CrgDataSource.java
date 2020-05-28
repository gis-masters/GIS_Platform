package ru.mycrg.data_service.dao;

import lombok.extern.java.Log;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;
import java.util.logging.Logger;

import static ru.mycrg.data_service.security.CrgClaimsParser.getOrganizationId;

/**
 * Наш декоратор над DataSource.
 * В нем мы подменяем базу данных исходя из инфы в токене пользователя.
 */
@Log
public class CrgDataSource extends CrgDataSourcesPool implements DataSource {

    private final DataSource dataSource;
    private final HttpServletRequest httpServletRequest;

    public CrgDataSource(DataSource dataSource, HttpServletRequest httpServletRequest) {
        this.dataSource = dataSource;
        this.httpServletRequest = httpServletRequest;
    }

    @Override
    public Connection getConnection() throws SQLException {
        Long orgId = getOrganizationId(httpServletRequest.getUserPrincipal());
        String dbName = DEFAULT_DB_NAME + orgId;

        return getDataSource(dbName).getConnection();
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

}
