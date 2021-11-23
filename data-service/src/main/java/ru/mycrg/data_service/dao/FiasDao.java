package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

@Service
public class FiasDao {

    private final Logger log = LoggerFactory.getLogger(FiasDao.class);

    private final DatasourceFactory datasourceFactory;
    private Statement statement;
    private Connection connection;

    public FiasDao(DatasourceFactory datasourceFactory) {

        this.datasourceFactory = datasourceFactory;
        try {
            connection = datasourceFactory.getDataSource("crg_data_service").getConnection();
            statement = connection.createStatement();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void writeValue(Map<String, List<String>> infos) {
        String queryUpdate = "";

        try {
            for (Map.Entry<String, List<String>> info: infos.entrySet()) {

                List<String> queries = info.getValue();
                for (String query: queries) {
                    queryUpdate = query;
                    statement.executeUpdate(queryUpdate);
                }
            }
        } catch (SQLException e) {
            log.error(String.format("Не удалось записать в БД, sql:[%s],error: %s", queryUpdate, e.getMessage()));
        }
    }
}
