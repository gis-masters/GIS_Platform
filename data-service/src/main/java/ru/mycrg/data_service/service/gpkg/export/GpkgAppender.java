package ru.mycrg.data_service.service.gpkg.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service.service.gpkg.GpkgException;

import java.sql.Connection;
import java.sql.DriverManager;

@Repository
public class GpkgAppender {

    private final Logger log = LoggerFactory.getLogger(GpkgAppender.class);

    private final GpkgWriter gpkgWriter;

    public GpkgAppender(GpkgWriter gpkgWriter) {
        this.gpkgWriter = gpkgWriter;
    }

    public void append(String gpkgFileName, JsonNode schema, ExportResourceModel tableFullName) {
        log.debug("GpkgAppender.append {}, {}, tableFullName: {}", gpkgFileName, schema, tableFullName);

        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + gpkgFileName)) {
            // Создаем системную таблицу для хранения схем, если она не существует
            gpkgWriter.createSchemaTable(connection);

            // Сохраняем схему в системную таблицу
            gpkgWriter.saveSchema(connection, schema.toString(), tableFullName);

            log.info("Schema успешно добавлена в GPKG: {} для таблицы: {}", gpkgFileName, tableFullName);
        } catch (Exception e) {
            log.error("Ошибка добавление schema в GPKG: {} для таблицы: {}", gpkgFileName, tableFullName, e);

            throw new GpkgException("Не смогли добавить схему в GPKG для таблицы: " + tableFullName, e);
        }
    }

    public void append(String gpkgFileName, String vectorTable, String epsg, ExportResourceModel tableFullName) {
        log.debug("GpkgAppender.append table info {}, vectorTable: {}, epsg: {}, tableFullName: {}",
                  gpkgFileName, vectorTable, epsg, tableFullName);

        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + gpkgFileName)) {
            // Создаем таблицу для хранения информации о слоях, если она не существует
            gpkgWriter.createLayerInfoTable(connection);

            // Сохраняем информацию о слое в таблицу
            gpkgWriter.saveLayerInfo(connection, vectorTable, epsg, tableFullName);

            log.info("Успешно добавили информацию о таблице в GPKG: {}, layer: {}, epsg: {}, tableFullName: {}",
                     gpkgFileName, vectorTable, epsg, tableFullName);
        } catch (Exception e) {
            log.error("Ошибка добавления информации о таблице в GPKG: {}, layer: {}, epsg: {}, tableFullName: {}",
                      gpkgFileName, vectorTable, epsg, tableFullName, e);

            throw new GpkgException("Не смогли добавить информацию о таблице в GPKG для таблицы: " + tableFullName, e);
        }
    }
}
