package ru.mycrg.data_service.service.gpkg.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.service.gpkg.GpkgException;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.gpkg.StyleWithIcons;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

@Repository
public class GpkgAppender {

    private final Logger log = LoggerFactory.getLogger(GpkgAppender.class);

    private final GpkgWriter gpkgWriter;

    public GpkgAppender(GpkgWriter gpkgWriter) {
        this.gpkgWriter = gpkgWriter;
    }

    public void appendStylesAndSvgs(String gpkgFileName, List<StyleWithIcons> stylesAndSvgs) {
        log.debug("GpkgAppender.append stylesAndSvgs");

        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + gpkgFileName)) {
            gpkgWriter.createIfNotExistSvgTable(connection);
            gpkgWriter.createIfNotExistStylesTable(connection);

            gpkgWriter.addStylesAndSvgs(connection, stylesAndSvgs);
        } catch (Exception e) {
            log.debug("Ошибка добавление стилей и SVG в GPKG: {}. Причина: {}", gpkgFileName, e.getMessage());

            throw new GpkgException("Не смогли добавить стили и svg в файл: " + gpkgFileName);
        }
    }

    public void appendLayersInfo(String gpkgFileName, List<LayerProjection> layerProjections) {
        log.debug("GpkgAppender.append LayersInfo");
        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + gpkgFileName)) {
            gpkgWriter.createIfNotExistLayerTable(connection);

            gpkgWriter.addLayersProjection(connection, layerProjections);
        } catch (Exception e) {
            log.debug("Ошибка добавление информации о слоях в файл: {}. Причина: {}", gpkgFileName, e.getMessage());

            throw new GpkgException("Не смогли добавить стили и svg в файл: " + gpkgFileName);
        }
    }

    public void appendVectorTableSchema(String gpkgFileName, JsonNode schema, ExportResourceModel resourceQualifier) {
        log.debug("GpkgAppender.append {}, {}, schemasAndTables: {}", gpkgFileName, schema, resourceQualifier);

        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + gpkgFileName)) {
            // Создаем системную таблицу для хранения схем, если она не существует
            gpkgWriter.createSchemaTable(connection);

            // Сохраняем схему в системную таблицу
            gpkgWriter.saveSchema(connection, schema.toString(), resourceQualifier);

            log.info("Schema успешно добавлена в GPKG: {} для таблицы: {}", gpkgFileName, resourceQualifier);
        } catch (Exception e) {
            log.debug("Ошибка добавление schema в GPKG: {} для таблицы: {}", gpkgFileName, resourceQualifier, e);

            throw new GpkgException("Не смогли добавить схему в GPKG для таблицы: " + resourceQualifier, e);
        }
    }

    public void appendVectorTableInfo(String gpkgFileName,
                                      String title,
                                      String crs,
                                      String description,
                                      ExportResourceModel tableFullName) {
        log.debug("GpkgAppender.append table info {}, title: {}, crs: {}, tableFullName: {}",
                  gpkgFileName, title, crs, tableFullName);

        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + gpkgFileName)) {
            // Создаем таблицу для хранения информации о слоях, если она не существует
            gpkgWriter.createVectorTableInfoTable(connection);

            // Сохраняем информацию о слое в таблицу
            gpkgWriter.saveVectorTableInfo(connection, title, crs, description, tableFullName);

            log.info("Успешно добавили информацию о таблице в GPKG: {}, title: {}, crs: {}, tableFullName: {}",
                     gpkgFileName, title, crs, tableFullName);
        } catch (Exception e) {
            log.debug("Ошибка добавления информации о таблице в GPKG: {}, title: {}, crs: {}, tableFullName: {}",
                      gpkgFileName, title, crs, tableFullName, e);

            throw new GpkgException("Не смогли добавить информацию о таблице в GPKG для таблицы: " + tableFullName,
                                    e);
        }
    }
}
