package ru.mycrg.data_service.dao.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import ru.mycrg.auth_facade.IAuthenticationFacade;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.no_context_transaction.NoContextTransactionAspect.threadDbConnections;

/**
 * Наш декоратор над DataSource. В нем мы подменяем базу данных исходя из инфы в токене пользователя.
 */
public class CrgDataSource extends DatasourceFactory implements DataSource {

    private final Logger log = LoggerFactory.getLogger(CrgDataSource.class);

    private final DataSource dataSource;
    private final HttpServletRequest httpServletRequest;
    private final IAuthenticationFacade authenticationFacade;

    public CrgDataSource(DataSource dataSource,
                         HttpServletRequest httpServletRequest,
                         IAuthenticationFacade authenticationFacade) {
        this.dataSource = dataSource;
        this.httpServletRequest = httpServletRequest;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Connection getConnection() throws SQLException {
        String dbName;

        // Пробуем достать имя БД для подключения из контекста потока
        if (threadDbConnections.get(Thread.currentThread()) != null) {
            dbName = threadDbConnections.get(Thread.currentThread());
        } else {
            Long orgId = authenticationFacade.getOrganizationId((Authentication) httpServletRequest.getUserPrincipal());

            if (orgId < 1) {
                dbName = INITIAL_DB_NAME;
                log.info("Selected initial db: {}", dbName);
            } else {
                dbName = getDefaultDatabaseName(orgId);
            }
        }

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
    public java.util.logging.Logger getParentLogger() throws SQLFeatureNotSupportedException {
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
