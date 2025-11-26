package ru.mycrg.data_service.service.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Менеджер для управления соединениями с GPKG файлами. Централизует логику создания соединений с SQLite базами данных в
 * формате GPKG.
 */
@Component
public class GpkgConnectionManager {

    private static final Logger log = LoggerFactory.getLogger(GpkgConnectionManager.class);
    private static final String SQLITE_JDBC_PREFIX = "jdbc:sqlite:";

    /**
     * Создает соединение с GPKG файлом по указанному пути.
     *
     * @param filePath путь к GPKG файлу
     *
     * @return соединение с GPKG файлом
     *
     * @throws SQLException  если не удалось создать соединение
     * @throws GpkgException если файл не существует или путь некорректен
     */
    public Connection createConnection(String filePath) throws SQLException {
        if (filePath == null || filePath.trim().isEmpty()) {
            throw new GpkgException("Путь к GPKG файлу не может быть пустым");
        }

        File file = new File(filePath);
        if (!file.exists()) {
            throw new GpkgException("GPKG файл не найден по пути: " + filePath);
        }

        if (!file.isFile()) {
            throw new GpkgException("Указанный путь не является файлом: " + filePath);
        }

        log.debug("Создание соединения с GPKG файлом: {}", filePath);

        try {
            String jdbcUrl = SQLITE_JDBC_PREFIX + file.getAbsolutePath();
            Connection connection = DriverManager.getConnection(jdbcUrl);
            log.debug("Соединение с GPKG файлом успешно создано: {}", jdbcUrl);

            return connection;
        } catch (SQLException e) {
            log.error("Ошибка соединения с GPKG файлом: {}", filePath, e);

            throw new GpkgException(
                    "Не удалось соединение с GPKG файлом: " + filePath + ". Причина: " + e.getMessage(), e);
        }
    }

    /**
     * Создает соединение с GPKG файлом по указанному пути без проверки существования файла. Используется для создания
     * новых GPKG файлов.
     *
     * @param filePath путь к GPKG файлу
     *
     * @return соединение с GPKG файлом
     */
    public Connection createConnectionForWriting(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            throw new GpkgException("Путь к GPKG файлу не может быть пустым");
        }

        log.debug("Создание соединения с GPKG файлом для записи: {}", filePath);

        try {
            String jdbcUrl = SQLITE_JDBC_PREFIX + new File(filePath).getAbsolutePath();
            Connection connection = DriverManager.getConnection(jdbcUrl);
            log.debug("Соединение с GPKG файлом для записи успешно создано: {}", jdbcUrl);

            return connection;
        } catch (SQLException e) {
            log.error("Ошибка соединения с GPKG файлом для записи: {}", filePath, e);

            throw new GpkgException(
                    "Не удалось соединение с GPKG файлом для записи: " + filePath + ". Причина: " + e.getMessage(), e);
        }
    }
}
