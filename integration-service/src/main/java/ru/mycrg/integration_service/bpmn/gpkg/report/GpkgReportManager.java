package ru.mycrg.integration_service.bpmn.gpkg.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.*;
import ru.mycrg.common_contracts.generated.gis_service.LayerType;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCopyDataBackwardEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.*;
import static ru.mycrg.common_contracts.generated.gis_service.LayerType.RASTER;

//TODO: Пересобрать класс через использование воркеров для Таблиц, Слоёв... с методами create, update, batchUpdate...
@Component
public class GpkgReportManager {

    private final Logger log = LoggerFactory.getLogger(GpkgReportManager.class);

    private final IMessageBusProducer messageBus;

    public GpkgReportManager(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    public void createReport(GpkgProcessContext rabbitDto, ExportGpkgEvent event) {
        GpkgProcessReport report = new GpkgProcessReport();
        report.setStatus(ACTIVE);
        String msg = "Запущен процесс экспорта в GPKG. Тип выгружаемых данных: " + event.getPayload().getType();
        report.getMessages().add(msg);
        report.setPayload(new GpkgPayloadData());

        event.setGpkgReport(report);

        sendReportInQueue(rabbitDto, report);
    }

    public void createProjectRepWithError(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                          Long projectId, String errorMessage) {
        GpkgImportDestinationProject projectReport = new GpkgImportDestinationProject(projectId);
        processReport.getPayload().setProject(projectReport);

        updateProjectReport(rabbitDto, processReport, ERROR, errorMessage);
    }

    public void createProjectReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                    Long projectId, String projectName) {
        GpkgImportDestinationProject projectReport = new GpkgImportDestinationProject(projectId);
        projectReport.setTitle(projectName);
        processReport.getPayload().setProject(projectReport);

        updateProjectReport(rabbitDto, processReport, ACTIVE, null);
    }

    public void createWrapperReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                    ErrorReport geoWrapperReport) {
        GpkgWrapperImportReport gwIr = new GpkgWrapperImportReport(geoWrapperReport.getFailedRecordCount(),
                                                                   geoWrapperReport.getUtf8ErrorCount());
        processReport.getPayload().setWrapperImportReport(gwIr);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void createTableReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                  String targetDatasetIdentifier, String currentTableOldName) {
        List<GpkgTable> tables = processReport.getPayload().getTables();
        GpkgTable table = new GpkgTable();
        table.setStatus(ACTIVE);
        table.setDataset(targetDatasetIdentifier);
        table.setOldTableIdentifier(currentTableOldName);
        tables.add(table);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void createTablesReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                   List<ExportResourceModel> tables) {
        List<GpkgTable> tablesRep = tables
                .stream()
                .map(erm -> new GpkgTable(ACTIVE, erm.getDataset(), erm.getTable()))
                .collect(Collectors.toList());

        processReport.getPayload().getTables().addAll(tablesRep);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void createLayerReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport, GpkgLayer curLayer) {
        List<GpkgLayer> prevLayers = processReport.getPayload().getLayers();
        prevLayers.add(curLayer);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void createLayerReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                  List<LayerProjection> layers) {
        List<GpkgLayer> layersReport = layers.
                stream().map(lp -> new GpkgLayer(ACTIVE,
                                                 lp.getTitle(),
                                                 lp.getStyleName(),
                                                 lp.getResourceId(),
                                                 lp.getSourceType(),
                                                 LayerType.valueOf(lp.getType().toUpperCase()))
                ).collect(Collectors.toList());

        processReport.getPayload().setLayers(layersReport);

        sendReportInQueue(rabbitDto, processReport);
    }

    /**
     * Возможно сетим слишком много. Можно переделывать.
     */
    public void createLayerReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                  GpkgTile tile) {
        GpkgLayer layerReport = new GpkgLayer();
        layerReport.setTitle(tile.getTitle());
        layerReport.setStatus(ACTIVE);
        layerReport.setStyleName("raster");
        layerReport.setType(RASTER);
        layerReport.setSource(tile.getLibraryIdentifier());
        layerReport.setTableIdentifier(tile.getField());
        layerReport.setCreatedTableId(tile.getDocumentId());

        processReport.getPayload().getLayers().add(layerReport);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateLayerReportWithCompleted(GpkgProcessContext rabbitDto, GpkgProcessReport report) {
        List<GpkgLayer> layers = report.getPayload().getLayers();

        layers.stream()
              .filter(layer -> layer.getStatus() == ACTIVE)
              .forEach(layer -> layer.setStatus(COMPLETED));

        sendReportInQueue(rabbitDto, report);
    }

    public void createStylesReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                   List<GpkgStyle> styles) {
        processReport.getPayload().getStyles().addAll(styles);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void createFileReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport, List<GpkgFile> files) {
        if (files != null && !files.isEmpty()) {
            processReport.getPayload().getFiles().addAll(files);
            sendReportInQueue(rabbitDto, processReport);
        }
    }

    public void updateReportWithMessage(GpkgProcessContext rabbitDto, GpkgProcessReport processReport, String msg) {
        processReport.getMessages().add(msg);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateProjectReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                    GpkgProcessStatus status) {
        GpkgImportDestinationProject projectReport = processReport.getPayload().getProject();
        projectReport.setStatus(status);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateProjectReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                    GpkgProcessStatus status, String msg) {
        GpkgImportDestinationProject projectReport = processReport.getPayload().getProject();
        projectReport.setStatus(status);

        if (msg != null) {
            projectReport.getMessages().add(msg);
        }

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateTableRepByIdentifier(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                           GpkgProcessStatus status, List<String> messages, String oldTableIdentifier) {
        GpkgTable table = findCurrentTable(processReport.getPayload().getTables(), oldTableIdentifier);
        table.setStatus(status);

        table.getMessages().addAll(messages);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateTableRepByIdentifier(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                           GpkgProcessStatus status, ImportGpkgCopyDataBackwardEvent reportData,
                                           String oldTableIdentifier) {
        GpkgTable table = findCurrentTable(processReport.getPayload().getTables(), oldTableIdentifier);
        table.setStatus(status);
        table.getMessages().addAll(reportData.getErrorReport().getMessages());

        table.setImportedObjects(reportData.getErrorReport().getSuccessfulRecordCount());
        table.setFailedObjects((long) reportData.getErrorReport().getFailedRecordCount());
        table.setImportedObjects(reportData.getErrorReport().getSuccessfulRecordCount());

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateTableRepByIdentifier(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                           GpkgProcessStatus status, String newIdentifier,
                                           String title, String oldTableIdentifier) {
        GpkgTable table = findCurrentTable(processReport.getPayload().getTables(), oldTableIdentifier);

        table.setStatus(status);
        table.setCreatedTableIdentifier(newIdentifier);
        table.setTitle(title);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateTableRepByIdentifier(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                           String msg, String oldTableIdentifier) {
        GpkgTable table = findCurrentTable(processReport.getPayload().getTables(), oldTableIdentifier);

        table.getMessages().add(msg);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void completeAllTablesInReport(GpkgProcessContext rabbitDto, GpkgProcessReport report, String gpkgPath) {
        report.setFilePath(gpkgPath);

        List<GpkgTable> tables = report.getPayload().getTables();

        tables.stream()
              .filter(table -> table.getStatus() == ACTIVE)
              .forEach(table -> table.setStatus(COMPLETED));

        sendReportInQueue(rabbitDto, report);
    }

    public void errorAllTablesInReport(GpkgProcessContext rabbitDto, GpkgProcessReport report) {
        List<GpkgTable> tables = report.getPayload().getTables();

        tables.stream()
              .filter(table -> table.getStatus() == ACTIVE)
              .forEach(table -> table.setStatus(ERROR));

        sendReportInQueue(rabbitDto, report);
    }

    public void errorTableRepByIdentifiers(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                           List<ExportResourceModel> unavailableResources) {
        List<GpkgTable> tables = processReport.getPayload().getTables();

        for (ExportResourceModel erm: unavailableResources) {
            tables.stream().filter(table ->
                                           table.getOldTableIdentifier().equals(erm.getTable()) &&
                                                   table.getDataset().equals(erm.getDataset()) &&
                                                   table.getStatus() == ACTIVE
            ).forEach(table -> {
                table.setStatus(ERROR);
                table.getMessages().add("Не хватает прав для экспорта указанной таблицы!");
            });
        }

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateStyleReportByIdentifier(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                              GpkgProcessStatus status, String body, String identifier) {
        GpkgStyle style = findCurrentStyle(processReport.getPayload().getStyles(), identifier);

        style.setStatus(status);
        style.setBody(body);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateStyleReportByIdentifier(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                              String msg, String identifier) {
        GpkgStyle style = findCurrentStyle(processReport.getPayload().getStyles(), identifier);

        style.getMessages().add(msg);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateStyleReportWithCompleted(GpkgProcessContext rabbitDto, GpkgProcessReport report) {
        List<GpkgStyle> styles = report.getPayload().getStyles();

        styles.stream()
              .filter(layer -> layer.getStatus() == ACTIVE)
              .forEach(layer -> {
                           layer.setStatus(COMPLETED);
                           layer.setBody("hidden body: ********");
                           layer.getSvgs().forEach(svg -> {
                               svg.setStatus(COMPLETED);
                               svg.setBody("hidden body: ********");
                           });
                       }
              );

        sendReportInQueue(rabbitDto, report);
    }

    public void updateSvgTitle(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                               String styleTitle, String path, String svgTitle) {
        GpkgStyle style = findCurrentStyle(processReport.getPayload().getStyles(), styleTitle);

        style.getSvgs().stream()
             .filter(s -> Objects.equals(s.getTitle(), svgTitle))
             .findFirst()
             .ifPresent(svg -> {
                 svg.setTitle(path);
                 svg.getMessages().add("Была создана новая SVG с именем: " + path);
             });

        sendReportInQueue(rabbitDto, processReport);
    }

    /**
     * НЕ отправляет отчёт каждый раз, потому что является частью стиля и обновится с ним.
     */
    public void updateSvgReport(GpkgProcessReport processReport, GpkgProcessStatus status,
                                String styleTitle, String svgTitle) {
        GpkgStyle style = findCurrentStyle(processReport.getPayload().getStyles(), styleTitle);

        style.getSvgs().stream()
             .filter(s -> Objects.equals(s.getTitle(), svgTitle))
             .findFirst()
             .ifPresent(svg -> svg.setStatus(status));
    }

    /**
     * НЕ отправляет отчёт каждый раз, потому что является частью стиля и обновится с ним.
     */
    public void hideSvgBody(GpkgProcessReport processReport, String styleTitle, String svgTitle) {
        GpkgStyle style = findCurrentStyle(processReport.getPayload().getStyles(), styleTitle);

        style.getSvgs().stream()
             .filter(s -> Objects.equals(s.getTitle(), svgTitle))
             .findFirst()
             .ifPresent(svg -> svg.setBody("hidden body: ********"));
    }

    public void updateFileReportWithError(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                          List<UUID> currentFileIds) {
        updateFileReportWithErrorCustomMsg(rabbitDto,
                                           processReport,
                                           currentFileIds,
                                           "При сохранении файла на сервере произошла ошибка!");
    }

    public void updateFileReportWithErrorCustomMsg(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                                   List<UUID> currentFileIds, String msg) {
        List<GpkgFile> filesReport = processReport.getPayload().getFiles();

        filesReport.stream()
                   .filter(fr -> currentFileIds.contains(fr.getOldId()))
                   .forEach((fileReport) -> {
                       fileReport.setStatus(ERROR);
                       fileReport.getMessages().add(msg);
                   });

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateFileIdInReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                     List<UUID> currentFileIds, UUID oldId, UUID newId) {
        List<GpkgFile> filesReport = processReport.getPayload().getFiles();

        filesReport.stream()
                   .filter(fr -> currentFileIds.contains(fr.getOldId()) && fr.getOldId().equals(oldId))
                   .forEach(fr -> fr.setNewId(newId));

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateFileReportWithCompleted(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                              List<UUID> currentFileIds) {
        List<GpkgFile> filesReport = processReport.getPayload().getFiles();

        filesReport.stream()
                   .filter(fr -> currentFileIds.contains(fr.getOldId()))
                   .forEach(fr -> fr.setStatus(COMPLETED));

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateGdalTilesReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                      List<GpkgTile> beforeGdal) {
        List<GpkgTile> gdalTilesFromReport = processReport.getPayload().getTiles().stream()
                                                          .filter(tile -> tile.getGpkgMediaReference() == null)
                                                          .collect(Collectors.toList());

        Map<String, GpkgTile> gdalTilesMap = beforeGdal.stream()
                                                       .collect(Collectors.toMap(
                                                               GpkgTile::getGpkgLayerTableName,
                                                               gpkgTile -> gpkgTile));
        gdalTilesFromReport.stream()
                           .filter(tile -> gdalTilesMap.containsKey(tile.getGpkgLayerTableName()))
                           .forEach(tile -> {
                               tile.setStatus(gdalTilesMap.get(tile.getGpkgLayerTableName()).getStatus());
                               tile.setTitle(gdalTilesMap.get(tile.getGpkgLayerTableName()).getTitle());
                               tile.getMessages().add("Растр был создан с использованием gdal_translate.");
                           });

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateTilesReportWithDone(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                          List<GpkgTile> extractedData) {
        List<GpkgTile> gdalTilesFromReport = processReport.getPayload().getTiles().stream()
                                                          .filter(tile -> tile.getGpkgMediaReference() == null)
                                                          .collect(Collectors.toList());

        Map<String, GpkgTile> gdalTilesMap = extractedData.stream()
                                                          .collect(Collectors.toMap(
                                                                  GpkgTile::getGpkgLayerTableName,
                                                                  gpkgTile -> gpkgTile));

        gdalTilesFromReport.stream()
                           .filter(tile -> gdalTilesMap.containsKey(tile.getGpkgLayerTableName()))
                           .forEach(tile -> {
                               tile.setStatus(COMPLETED);
                               tile.getMessages().add("Растр был успешно привязан к записи в библиотеке.");
                           });

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateTilesReportWithError(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                           List<GpkgTile> extractedData) {
        List<GpkgTile> gdalTilesFromReport = processReport.getPayload().getTiles().stream()
                                                          .filter(tile -> tile.getGpkgMediaReference() == null)
                                                          .collect(Collectors.toList());

        Map<String, GpkgTile> gdalTilesMap = extractedData.stream()
                                                          .collect(Collectors.toMap(
                                                                  GpkgTile::getGpkgLayerTableName,
                                                                  gpkgTile -> gpkgTile));

        gdalTilesFromReport.stream()
                           .filter(tile -> gdalTilesMap.containsKey(tile.getGpkgLayerTableName()))
                           .forEach(tile -> {
                               tile.setStatus(ERROR);
                               tile.getMessages().add("Растр не удалось привязать к библиотеке.");
                           });

        sendReportInQueue(rabbitDto, processReport);
    }

    public void updateLayerReportByTitle(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                         String title, GpkgProcessStatus status, String msg) {
        List<GpkgLayer> layerList = processReport.getPayload().getLayers();
        GpkgLayer currentLayer = layerList.stream()
                                          .filter(layer -> layer.getTitle().equals(title))
                                          .findFirst().orElse(null);

        if (currentLayer != null) {
            currentLayer.setStatus(status);
            currentLayer.getMessages().add(msg);
        }

        sendReportInQueue(rabbitDto, processReport);
    }

    public void appendLayerReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                  List<GpkgLayer> layers) {
        processReport.getPayload().getLayers().addAll(layers);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void createTileReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                                 List<GpkgTile> tiles) {
        processReport.getPayload().getTiles().addAll(tiles);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void errorAllRastersReport(GpkgProcessContext rabbitDto, GpkgProcessReport gpkgReport, String msg) {
        List<GpkgTile> tiles = gpkgReport.getPayload().getTiles();
        List<GpkgLayer> layers = gpkgReport.getPayload().getLayers();

        tiles.stream()
             .filter(tile -> tile.getStatus() == ACTIVE)
             .forEach(tile -> {
                 tile.setStatus(ERROR);
                 tile.getMessages().add(msg);
             });

        layers.stream()
              .filter(layer -> layer.getStatus() == ACTIVE && layer.getType() == RASTER)
              .forEach(layer -> {
                  layer.setStatus(ERROR);
                  layer.getMessages().add(msg);
              });

        sendReportInQueue(rabbitDto, gpkgReport);
    }

    public void mergeGdalTilesReport(GpkgProcessContext rabbitDto, GpkgProcessReport gpkgReport,
                                     List<GpkgTile> newReport) {
        Map<String, GpkgTile> titleToTile = newReport.stream()
                                                     .collect(Collectors.toMap(GpkgReportBaseDto::getTitle,
                                                                               tile -> tile));

        log.debug("Что тут происходит new {}", newReport);
        log.debug("Что тут происходит titleToTile {}", titleToTile);
        log.debug("Что тут происходит report {}", gpkgReport.getPayload().getTiles());


        gpkgReport.getPayload().getTiles().forEach(tile -> {
            GpkgTile newTile = titleToTile.get(tile.getResourceId());
            tile.setStatus(newTile.getStatus());
            tile.getMessages().addAll(newTile.getMessages());
        });

        sendReportInQueue(rabbitDto, gpkgReport);
    }

    public void updateTileReportWithResources(GpkgProcessContext rabbitDto, GpkgProcessReport gpkgReport,
                                              Map<String, String> resourceAndPath) {
        gpkgReport.getPayload().getTiles().stream()
                  .filter(tile -> tile.getStatus() == ACTIVE)
                  .forEach(tile -> {
                      String ri = tile.getResourceId();
                      if (resourceAndPath.containsKey(ri)) {
                          tile.setPathFromGeoserver(resourceAndPath.get(ri));
                      } else {
                          tile.setStatus(ERROR);
                          tile.getMessages().add("Не удалось найти путь к растровому файлу");
                      }
                  });

        sendReportInQueue(rabbitDto, gpkgReport);
    }

    public void finalizeReport(GpkgProcessContext rabbitDto, GpkgProcessReport processReport,
                               GpkgProcessStatus status, String msg) {
        GpkgPayloadData payload = processReport.getPayload();

        if (payload == null) {
            payload = new GpkgPayloadData();
        }

        if (payload.getProject() != null) {
            GpkgImportDestinationProject project = payload.getProject();
            project.setStatus(status);
        }

        processReport.setStatus(status);

        processReport.getMessages().add(msg);

        sendReportInQueue(rabbitDto, processReport);
    }

    public void finalizeReport(GpkgProcessContext rabbitDto, String msg) {
        GpkgProcessReport processReport = new GpkgProcessReport();
        processReport.setStatus(ERROR);
        processReport.getMessages().add(msg);

        finalizeReport(rabbitDto, processReport, ERROR, msg);
    }

    private void sendReportInQueue(GpkgProcessContext rabbitDto, GpkgProcessReport processReport) {
        PatchProcess newDetails = new PatchProcess(rabbitDto.getProcessStatus(), processReport);
        messageBus.produce(new UpdateProcessEvent(rabbitDto.getProcessId(),
                                                  rabbitDto.getDbName(),
                                                  newDetails));

        log.debug("Сообщение на обновление статуса процесса поставлено в очередь.");
    }

    private GpkgStyle findCurrentStyle(List<GpkgStyle> tables, String styleTitle) {
        return tables
                .stream()
                .filter(t -> Objects.equals(t.getTitle(), styleTitle))
                .findFirst()
                .orElseGet(() -> {
                    GpkgStyle newStyle = new GpkgStyle();
                    newStyle.setTitle(styleTitle);
                    newStyle.setStatus(ACTIVE);

                    return newStyle;
                });
    }

    private GpkgTable findCurrentTable(List<GpkgTable> tables, String tableGpkgIdentifier) {
        return tables
                .stream()
                .filter(t -> Objects.equals(t.getOldTableIdentifier(), tableGpkgIdentifier))
                .findFirst()
                .orElseGet(() -> {
                    GpkgTable newTable = new GpkgTable();
                    newTable.setOldTableIdentifier(tableGpkgIdentifier);
                    tables.add(newTable);

                    return newTable;
                });
    }
}
