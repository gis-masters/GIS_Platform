package ru.mycrg.integration_service.bpmn.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.*;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCopyDataBackwardEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.*;

@Component
public class GpkgImportReportManager {

    private final Logger log = LoggerFactory.getLogger(GpkgImportReportManager.class);

    private final IMessageBusProducer messageBus;

    public GpkgImportReportManager(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    //TODO: возможно сделать приватным, возможно поменять все листы на сеты
    public GpkgImportedTable findCurrentTable(List<GpkgImportedTable> tables, String tableGpkgIdentifier) {
        return tables
                .stream()
                .filter(t -> Objects.equals(t.getOldTableIdentifier(), tableGpkgIdentifier))
                .findFirst()
                .orElseGet(() -> {
                    GpkgImportedTable newTable = new GpkgImportedTable();
                    newTable.setOldTableIdentifier(tableGpkgIdentifier);
                    tables.add(newTable);

                    return newTable;
                });
    }

    public void createProjectRepWithError(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                          Long projectId, String errorMessage) {
        GpkgImportDestinationProject projectReport = new GpkgImportDestinationProject(projectId);
        payload.setProject(projectReport);

        updateProjectReport(rabbitDto, payload, ERROR, errorMessage);
    }

    public void createProjectReport(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                    Long projectId, String projectName) {
        GpkgImportDestinationProject projectReport = new GpkgImportDestinationProject(projectId);
        projectReport.setTitle(projectName);
        payload.setProject(projectReport);

        updateProjectReport(rabbitDto, payload, ACTIVE, null);
    }

    public void createWrapperReport(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                    ErrorReport geoWrapperReport) {
        GpkgWrapperImportReport gwIr = new GpkgWrapperImportReport(geoWrapperReport.getFailedRecordCount(),
                                                                   geoWrapperReport.getUtf8ErrorCount());
        payload.setWrapperImportReport(gwIr);

        sendReportInQueue(payload,rabbitDto);
    }

    public void createTableReport(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                  String targetDatasetIdentifier, String currentTableOldName) {
        List<GpkgImportedTable> tables = payload.getTables();
        GpkgImportedTable table = new GpkgImportedTable();
        table.setStatus(ACTIVE);
        table.setDataset(targetDatasetIdentifier);
        table.setOldTableIdentifier(currentTableOldName);
        tables.add(table);

        sendReportInQueue(payload,rabbitDto);
    }

    public void createStylesReport(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                   List<GpkgImportedStyles> styles) {
        payload.setStyles(styles);

        sendReportInQueue(payload,rabbitDto);
    }

    public void createLayerReport(ReportSendConfigDto rabbitDto, GpkgPayloadData payload, GpkgImportedLayer curLayer) {
        List<GpkgImportedLayer> prevLayers = payload.getLayers();
        prevLayers.add(curLayer);

        sendReportInQueue(payload,rabbitDto);
    }

    public void createFileReport(ReportSendConfigDto rabbitDto, GpkgPayloadData payload, List<GpkgImportedFile> files) {
        List<GpkgImportedFile> existingFiles = payload.getFiles();
        existingFiles.addAll(files);

        sendReportInQueue(payload,rabbitDto);
    }

    public void updateProjectReport(ReportSendConfigDto rabbitDto, GpkgPayloadData payload, GpkgProcessStatus status) {
        GpkgImportDestinationProject projectReport = payload.getProject();
        projectReport.setStatus(status);

        sendReportInQueue(payload,rabbitDto);
    }

    public void updateProjectReport(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                    GpkgProcessStatus status, String msg) {
        GpkgImportDestinationProject projectReport = payload.getProject();
        projectReport.setStatus(status);

        if (msg != null) {
            projectReport.getMessages().add(msg);
        }

        sendReportInQueue(payload,rabbitDto);
    }

    public void updateTableRepByIdentifier(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                           GpkgProcessStatus status, List<String> messages, String oldTableIdentifier) {
        GpkgImportedTable table = findCurrentTable(payload.getTables(), oldTableIdentifier);
        table.setStatus(status);

        table.getMessages().addAll(messages);

        sendReportInQueue(payload,rabbitDto);
    }

    public void updateTableRepByIdentifier(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                           GpkgProcessStatus status, ImportGpkgCopyDataBackwardEvent reportData,
                                           String oldTableIdentifier) {
        GpkgImportedTable table = findCurrentTable(payload.getTables(), oldTableIdentifier);
        table.setStatus(status);

        table.getMessages().addAll(reportData.getErrorReport().getMessages());

        table.setImportedObjects(reportData.getErrorReport().getSuccessfulRecordCount());
        table.setFailedObjects((long) reportData.getErrorReport().getFailedRecordCount());

        sendReportInQueue(payload,rabbitDto);
    }

    public void updateTableRepByIdentifier(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                           GpkgProcessStatus status, String newIdentifier,
                                           String title, String oldTableIdentifier) {
        GpkgImportedTable table = findCurrentTable(payload.getTables(), oldTableIdentifier);

        table.setStatus(status);
        table.setCreatedTableIdentifier(newIdentifier);
        table.setTitle(title);

        sendReportInQueue(payload,rabbitDto);
    }

    public void updateTableRepByIdentifier(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                           String msg, String oldTableIdentifier) {
        GpkgImportedTable table = findCurrentTable(payload.getTables(), oldTableIdentifier);

        table.getMessages().add(msg);

        sendReportInQueue(payload, rabbitDto);
    }

    public void updateStyleReportByIdentifier(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                              GpkgProcessStatus status, String body, String identifier) {
        GpkgImportedStyles style = findCurrentStyle(payload.getStyles(), identifier);

        style.setStatus(status);
        style.setBody(body);

        sendReportInQueue(payload, rabbitDto);
    }

    public void updateStyleReportByIdentifier(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                              String msg, String identifier) {
        GpkgImportedStyles style = findCurrentStyle(payload.getStyles(), identifier);

        style.getMessages().add(msg);

        sendReportInQueue(payload, rabbitDto);
    }

    public void updateSvgTitle(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                               String styleTitle, String path, String svgTitle) {
        GpkgImportedStyles style = findCurrentStyle(payload.getStyles(), styleTitle);

        style.getSvgs().stream()
             .filter(s -> Objects.equals(s.getTitle(), svgTitle))
             .findFirst()
             .ifPresent(svg -> {
                 svg.setTitle(path);
                 svg.getMessages().add("Была создана новая SVG с именем: " + path);
             });

        sendReportInQueue(payload, rabbitDto);
    }

    /**
     * НЕ отправляет отчёт каждый раз, потому что является частью стиля и обновится с ним.
     */
    public void updateSvgReport(GpkgPayloadData payload, GpkgProcessStatus status,
                                String styleTitle, String svgTitle) {
        GpkgImportedStyles style = findCurrentStyle(payload.getStyles(), styleTitle);

        style.getSvgs().stream()
             .filter(s -> Objects.equals(s.getTitle(), svgTitle))
             .findFirst()
             .ifPresent(svg -> svg.setStatus(status));
    }

    /**
     * НЕ отправляет отчёт каждый раз, потому что является частью стиля и обновится с ним.
     */
    public void hideSvgBody(GpkgPayloadData payload, String styleTitle, String svgTitle) {
        GpkgImportedStyles style = findCurrentStyle(payload.getStyles(), styleTitle);

        style.getSvgs().stream()
             .filter(s -> Objects.equals(s.getTitle(), svgTitle))
             .findFirst()
             .ifPresent(svg -> svg.setBody("hidden body: ********"));
    }

    public void updateFileReportWithError(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                          List<UUID> currentFileIds) {
        updateFileReportWithErrorCustomMsg(rabbitDto,
                                           payload,
                                           currentFileIds,
                                           "При сохранении файла на сервере произошла ошибка!");
    }

    public void updateFileReportWithErrorCustomMsg(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                                   List<UUID> currentFileIds, String msg) {
        List<GpkgImportedFile> filesReport = payload.getFiles();

        filesReport.stream()
                   .filter(fr -> currentFileIds.contains(fr.getOldId()))
                   .forEach((fileReport) -> {
                       fileReport.setStatus(ERROR);
                       fileReport.getMessages().add(msg);
                   });

        sendReportInQueue(payload, rabbitDto);
    }

    public void updateFileIdInReport(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                     List<UUID> currentFileIds, UUID oldId, UUID newId) {
        List<GpkgImportedFile> filesReport = payload.getFiles();

        filesReport.stream()
                   .filter(fr -> currentFileIds.contains(fr.getOldId()) && fr.getOldId().equals(oldId))
                   .forEach(fr -> fr.setNewId(newId));

        sendReportInQueue(payload, rabbitDto);
    }

    public void updateFileReportWithCompleted(ReportSendConfigDto rabbitDto, GpkgPayloadData payload,
                                              List<UUID> currentFileIds) {
        List<GpkgImportedFile> filesReport = payload.getFiles();

        filesReport.stream()
                   .filter(fr -> currentFileIds.contains(fr.getOldId()))
                   .forEach(fr -> fr.setStatus(COMPLETED));

        sendReportInQueue(payload, rabbitDto);
    }

    public void finalizeReport(ReportSendConfigDto rabbitDto, GpkgImportReport importReport,
                               GpkgProcessStatus gpkgProcessStatus, String msg) {
        GpkgPayloadData payload = importReport.getPayload();
        GpkgImportDestinationProject project = payload.getProject();
        project.setStatus(gpkgProcessStatus);
        importReport.setStatus(gpkgProcessStatus);

        importReport.getMessages().add(msg);

        sendReportInQueue(importReport, rabbitDto);
    }

    private void sendReportInQueue(Object payload, ReportSendConfigDto rabbitDto) {
        PatchProcess newDetails = new PatchProcess(rabbitDto.getProcessStatus(), payload);
        messageBus.produce(new UpdateProcessEvent(rabbitDto.getProcessId(),
                                                  rabbitDto.getBusinessKey(),
                                                  rabbitDto.getDbName(),
                                                  newDetails));

        log.debug("Сообщение на обновление статуса процесса поставлено в очередь.");
    }

    private GpkgImportedStyles findCurrentStyle(List<GpkgImportedStyles> tables, String styleTitle) {
        return tables
                .stream()
                .filter(t -> Objects.equals(t.getTitle(), styleTitle))
                .findFirst()
                .orElseGet(() -> {
                    GpkgImportedStyles newStyle = new GpkgImportedStyles();
                    newStyle.setTitle(styleTitle);
                    newStyle.setStatus(ACTIVE);

                    return newStyle;
                });
    }
}
