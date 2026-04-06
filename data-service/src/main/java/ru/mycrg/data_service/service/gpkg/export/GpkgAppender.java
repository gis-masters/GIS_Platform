package ru.mycrg.data_service.service.gpkg.export;

 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgStyle;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.service.gpkg.GpkgConnectionManager;
import ru.mycrg.data_service.service.gpkg.GpkgException;
import ru.mycrg.data_service.service.gpkg.export.tables.*;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import tools.jackson.databind.JsonNode;

import java.sql.Connection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.data_service.service.gpkg.export.tables.GpkgExtRelationsWriter.GPKG_EXT_RELATION_TABLE;
import static ru.mycrg.data_service.service.gpkg.export.tables.LayerInfoWriter.GPKG_LAYER_INFO_TABLE;
import static ru.mycrg.data_service.service.gpkg.export.tables.LayerStyleWriter.GPKG_STYLE_LAYER_TABLE;
import static ru.mycrg.data_service.service.gpkg.export.tables.MediaFilesWriter.GPKG_MEDIA_FILES_TABLE;
import static ru.mycrg.data_service.service.gpkg.export.tables.MediaToFeaturesWriter.GPKG_MEDIA_TO_FEATURES_TABLE;
import static ru.mycrg.data_service.service.gpkg.export.tables.SvgContentWriter.GPKG_SVG_CONTENT_TABLE;
import static ru.mycrg.data_service.service.gpkg.export.tables.VectorTableInfoWriter.GPKG_VECTOR_TABLE_INFO_TABLE;
import static ru.mycrg.data_service.service.gpkg.export.tables.VectorTableSchemasWriter.GPKG_VECTOR_TABLE_SCHEMAS_TABLE;
import static ru.mycrg.http_client.JsonConverter.fromJson;

@Service
public class GpkgAppender {

    private final Logger log = LoggerFactory.getLogger(GpkgAppender.class);

    private final GpkgConnectionManager connectionManager;

    private final VectorTableInfoWriter vectorTableInfoWriter;
    private final VectorTableSchemasWriter vectorTableSchemasWriter;
    private final LayerInfoWriter layerInfoWriter;
    private final LayerStyleWriter layerStyleWriter;
    private final SvgContentWriter svgWriter;
    private final MediaFilesWriter mediaFilesWriter;
    private final GpkgExtRelationsWriter relationsWriter;
    private final MediaToFeaturesWriter mediaToFeaturesWriter;

    private final OgcDefaultWriter ogcDefaultWriter;

    private final FileStorageService fileStorageService;

    public GpkgAppender(GpkgConnectionManager connectionManager,
                        VectorTableInfoWriter vectorTableInfoWriter,
                        VectorTableSchemasWriter vectorTableSchemasWriter,
                        LayerInfoWriter layerInfoWriter,
                        LayerStyleWriter layerStyleWriter,
                        SvgContentWriter svgWriter,
                        MediaFilesWriter mediaFilesWriter,
                        GpkgExtRelationsWriter relationsWriter,
                        MediaToFeaturesWriter mediaToFeaturesWriter,
                        OgcDefaultWriter ogcDefaultWriter,
                        FileStorageService fileStorageService) {
        this.connectionManager = connectionManager;

        this.vectorTableInfoWriter = vectorTableInfoWriter;
        this.vectorTableSchemasWriter = vectorTableSchemasWriter;
        this.layerInfoWriter = layerInfoWriter;
        this.layerStyleWriter = layerStyleWriter;
        this.svgWriter = svgWriter;
        this.mediaFilesWriter = mediaFilesWriter;
        this.relationsWriter = relationsWriter;
        this.mediaToFeaturesWriter = mediaToFeaturesWriter;

        this.ogcDefaultWriter = ogcDefaultWriter;

        this.fileStorageService = fileStorageService;
    }

    public void appendVectorTableInfo(String gpkgFileName,
                                      String title,
                                      String crs,
                                      String description,
                                      ExportResourceModel tableFullName) {
        log.debug("GpkgAppender.append table info {}, title: {}, crs: {}, tableFullName: {}",
                  gpkgFileName, title, crs, tableFullName);

        try (Connection connection = connectionManager.createConnectionForWriting(gpkgFileName)) {
            // Создаем таблицу для хранения информации о слоях, если она не существует
            vectorTableInfoWriter.createTableIfNotExist(connection);
            ogcDefaultWriter.insert(connection, GPKG_VECTOR_TABLE_INFO_TABLE, description);

            // Сохраняем информацию о векторной таблице
            vectorTableInfoWriter.insert(connection, title, crs, description, tableFullName);

            log.info("Успешно добавили информацию о таблице в GPKG: {}, title: {}, crs: {}, tableFullName: {}",
                     gpkgFileName, title, crs, tableFullName);
        } catch (Exception e) {
            log.debug("Ошибка добавления информации о таблице в GPKG: {}, title: {}, crs: {}, tableFullName: {}",
                      gpkgFileName, title, crs, tableFullName, e);

            throw new GpkgException("Не смогли добавить информацию о таблице в GPKG для таблицы: " + tableFullName,
                                    e);
        }
    }

    public void appendVectorTableSchema(String gpkgFileName, JsonNode schema, ExportResourceModel resourceQualifier) {
        log.debug("GpkgAppender.append {}, {}, schemasAndTables: {}", gpkgFileName, schema, resourceQualifier);

        try (Connection connection = connectionManager.createConnectionForWriting(gpkgFileName)) {
            // Создаем системную таблицу для хранения схем, если она не существует
            vectorTableSchemasWriter.createTableIfNotExist(connection);
            ogcDefaultWriter.insert(connection,
                                    GPKG_VECTOR_TABLE_SCHEMAS_TABLE,
                                    "Хранит информацию о crg-схемах.");

            // Сохраняем схему в системную таблицу
            vectorTableSchemasWriter.insert(connection, schema.toString(), resourceQualifier);

            log.info("Schema успешно добавлена в GPKG: {} для таблицы: {}", gpkgFileName, resourceQualifier);
        } catch (Exception e) {
            log.debug("Ошибка добавление schema в GPKG: {} для таблицы: {}", gpkgFileName, resourceQualifier, e);

            throw new GpkgException("Не смогли добавить схему в GPKG для таблицы: " + resourceQualifier, e);
        }
    }

    public void appendLayersInfo(String gpkgFileName, List<LayerProjection> layerProjections) {
        log.debug("GpkgAppender.append LayersInfo");
        try (Connection connection = connectionManager.createConnectionForWriting(gpkgFileName)) {
            layerInfoWriter.createTableIfNotExist(connection);
            ogcDefaultWriter.insert(connection,
                                    GPKG_LAYER_INFO_TABLE,
                                    "Хранит информацию о crg-слоях.");

            layerInfoWriter.insert(connection, layerProjections);
        } catch (Exception e) {
            log.debug("Ошибка добавление информации о слоях в файл: {}. Причина: {}", gpkgFileName, e.getMessage());

            throw new GpkgException("Не смогли добавить информацию о слоях в файл: " + gpkgFileName, e);
        }
    }

    public void appendStylesAndSvgs(String gpkgFileName, List<GpkgStyle> stylesAndSvgs) {
        log.debug("GpkgAppender.append stylesAndSvgs");

        try (Connection connection = connectionManager.createConnectionForWriting(gpkgFileName)) {
            layerStyleWriter.createTableIfNotExist(connection);
            ogcDefaultWriter.insert(connection,
                                    GPKG_STYLE_LAYER_TABLE,
                                    "OGC стандарт для хранения стилей.");

            //Можно не создавать эту таблицу заранее, но это несущественно.
            svgWriter.createTableIfNotExist(connection);
            ogcDefaultWriter.insert(connection,
                                    GPKG_SVG_CONTENT_TABLE,
                                    "Хранит информацию о svg для стилей.");

            for (GpkgStyle styleAndSvg: stylesAndSvgs) {
                layerStyleWriter.insert(connection, styleAndSvg);

                svgWriter.insert(connection, styleAndSvg);
            }
        } catch (Exception e) {
            log.debug("Ошибка добавление стилей и SVG в GPKG: {}. Причина: {}", gpkgFileName, e.getMessage());

            throw new GpkgException("Не смогли добавить стили и svg в файл: " + gpkgFileName, e);
        }
    }

    public void appendFiles(String gpkgFileName, List<File> filesToExport) {
        log.debug("GpkgAppender.append Добавляем в gpkg {} файлов", filesToExport.size());

        try (Connection connection = connectionManager.createConnectionForWriting(gpkgFileName)) {
            createAllOgcMediaSubjections(connection);

            // Сохраняем информацию о файлах в таблицу
            for (File file: filesToExport) {
                //TODO: часто попадаем на other секцию. При импорте не влияет но желательно пофиксить
                Optional<FileResourceQualifier> oResQualifier = fromJson(file.getResourceQualifier().toString(),
                                                                         FileResourceQualifier.class);

                byte[] fileContent = fileStorageService.loadFileLikeByteArray(file.getPath());

                relationsWriter.insert(connection,
                                       oResQualifier.map(FileResourceQualifier::getTable).orElse("")
                );

                Long mediaId = mediaFilesWriter.insert(connection, fileContent, file.getId(), null, file.getPath(),
                                                       file.getTitle(), file.getExtension(), file.getSize());

                mediaToFeaturesWriter
                        .insert(connection,
                                mediaId,
                                oResQualifier.map(FileResourceQualifier::getRecordId)
                                             .orElse(-418L));
            }

            log.info("Успешно добавили информацию о файлах в GPKG");
        } catch (Exception e) {
            log.debug("Ошибка добавления информации о файлах в GPKG: {}", e.getMessage());

            throw new GpkgException("Не смогли добавить gpkg в файл: " + e.getMessage());
        }
    }

    public void appendRasterFiles(String pathToGpkg, Map<String, File> rasterLikeFile) {
        if (rasterLikeFile.isEmpty()) {
            log.error("Неожиданная ошибка при попытке смапить файлы к их resource_id слоёв");

            return;
        }

        log.debug("GpkgAppender.append Добавляем растры в gpkg. Всего растров: {}", rasterLikeFile.size());

        try (Connection connection = connectionManager.createConnectionForWriting(pathToGpkg)) {
            createAllOgcMediaSubjections(connection);
            for (Map.Entry<String, File> entry: rasterLikeFile.entrySet()) {
                File file = entry.getValue();
                byte[] fileContent = fileStorageService.loadFileLikeByteArray(file.getPath());

                mediaFilesWriter.insert(connection, fileContent, file.getId(), entry.getKey(),
                                        file.getPath(), file.getTitle(), file.getExtension(), file.getSize());
            }
        } catch (Exception e) {
            log.debug("Ошибка добавления растров в GPKG: {}", e.getMessage());

            throw new GpkgException("Не смогли добавить растр как Blob в gpkg. Причина: " + e.getMessage());
        }
    }

    /**
     * <p>Метод модифицирует внутреннюю структуру GPKG для хранения в ней файлов,
     * в соответствии с требованиями OGC.</p>
     *
     * <p>Выполняет следующие действия (идемпотентно):</p>
     * <ul>
     *   <li>Создаёт таблицу {@code media_files} для хранения
     *       бинарного содержимого файлов (BLOB) и связанных атрибутов
     *       (например, MIME-типа, имени файла и т.п.).</li>
     *   <li>Создаёт служебную таблицу {@code gpkgext_relations},
     *       используемую расширением OGC GeoPackage Related Tables.</li>
     *   <li>Создаёт mapping-таблицу {@code features_media_relation},
     *       обеспечивающую связь "фича → медиазапись" между базовой таблицей
     *       с объектами (features) и таблицей {@code media_files}.</li>
     * </ul>
     *
     * @param connection подключение к определённому gpkg
     */
    private void createAllOgcMediaSubjections(Connection connection) {
        try {
            mediaFilesWriter.createTableIfNotExist(connection);
            ogcDefaultWriter.insert(connection,
                                    GPKG_MEDIA_FILES_TABLE,
                                    "OGC стандарт для хранения файлов");

            relationsWriter.createTableIfNotExist(connection);
            ogcDefaultWriter.insert(connection, GPKG_EXT_RELATION_TABLE);

            mediaToFeaturesWriter.createTableIfNotExist(connection);
            ogcDefaultWriter.insert(connection, GPKG_MEDIA_TO_FEATURES_TABLE);

            log.info("В GPKG успешно созданы все таблицы, необходимые для хранения файлов");
        } catch (Exception e) {
            String msg = String.format("Произошла ошибка при создания таблиц для хранения файлов. Подробнее => %s",
                                       e.getMessage());
            log.info(msg);

            throw new GpkgException(msg);
        }
    }
}
