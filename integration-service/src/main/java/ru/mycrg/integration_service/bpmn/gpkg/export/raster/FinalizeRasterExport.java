package ru.mycrg.integration_service.bpmn.gpkg.export.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.CHECK_STATUS_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EXPORT_GPKG_EVENT;

@Service("finalizeRasterExport")
public class FinalizeRasterExport implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(FinalizeRasterExport.class);

    private final GpkgReportManager reportManager;

    public FinalizeRasterExport(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        String status = (String) delegateExecution.getVariable(CHECK_STATUS_VAR_NAME);

        String msg;
        switch (status) {
            case "allResourcesUnavailable":
                msg = "Все растры НЕ могут быть выгружены. Останавливаем ветку экспорта растров.";
                log.error(msg);
                reportManager.errorAllRastersReport(rabbitDto, event.getGpkgReport(), msg);

                break;
            case "allFilePathsBroken":
                msg = "Не удалось пути к файлам растров на сервере. Останавливаем ветку экспорта растров.";
                log.warn(msg);
                reportManager.errorAllRastersReport(rabbitDto, event.getGpkgReport(), msg);

                break;
            case "rasterGdalWorkFail":
                msg = "Geo-wrapper вернул ошибку создания тайлового слоя в gpkg. Останавливаем ветку экспорта растров.";
                log.warn(msg);

                reportManager.errorAllRastersReport(rabbitDto, event.getGpkgReport(), msg);

                break;
            default:
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "doneAllRasters");
        }
        //Негативные сценарии мы покрыли в switch
        //Тут же можно детализировать и покрыть случае неожиданных Error насытить дополнительно отчёт и т.д.
        //Такой вот вспомогательный делегат для записи негатива в отчёт.
        //Основная идея в том что мы всё равно идём по процессу дальше потому что у нас отдельные делегаты завершения
        // процесса
    }
}
