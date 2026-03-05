package ru.mycrg.integration_service.bpmn.gpkg.export.main;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("endExportProcessError")
public class EndExportProcessError implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(EndExportProcessError.class);

    private final GpkgReportManager reportManager;

    public EndExportProcessError(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", EndExportProcessError.class.getSimpleName());

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        GpkgProcessReport exportReport = event.getGpkgReport();

        String pathToGpkg;
        try {
            if (delegateExecution.getVariable(EXPORT_GPKG_PATH_TO_GPKG) != null
                    && !delegateExecution.getVariable(EXPORT_GPKG_PATH_TO_GPKG).toString().isBlank()) {
                pathToGpkg = delegateExecution.getVariable(EXPORT_GPKG_PATH_TO_GPKG).toString();
                exportReport.setFilePath(pathToGpkg);
            }
        } catch (Exception e) {
            log.warn("При экспорте gpkg не удалось создать главный файл: {}", e.getMessage());
        }

        String status = (String) delegateExecution.getVariable(CHECK_STATUS_VAR_NAME);
        String msg = "Невозможно успешно завершить экспорт GPKG. Причина: ";

        switch (status) {
            case "dontKnowHow":
                msg = msg + "Невозможно экспортировать запрошенный тип объектов.";
                break;
            case "allLayersUnavailable":
                msg = msg + "Все запрошенные слои не существуют.";
                break;
            case "allResourcesUnavailable":
                msg = msg + "Все указанные ресурсы НЕДОСТУПНЫ пользователю для экспорта.";
                break;
            default:
                msg = msg + "gpkg не был сформирован в течении 5 минут. Останавливаем процесс.";
        }

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              ERROR);

        reportManager.finalizeReport(rabbitDto, exportReport, GpkgProcessStatus.ERROR, msg);

        log.debug("Выполнение процесса экспорта geoPackage потерпело неудачу!");
    }
}
