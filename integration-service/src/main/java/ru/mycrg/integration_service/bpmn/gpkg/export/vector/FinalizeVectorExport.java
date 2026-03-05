package ru.mycrg.integration_service.bpmn.gpkg.export.vector;

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

@Service("finalizeVectorExport")
public class FinalizeVectorExport implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(FinalizeVectorExport.class);

    private final GpkgReportManager reportManager;

    public FinalizeVectorExport(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        String status = (String) delegateExecution.getVariable(CHECK_STATUS_VAR_NAME);

        switch (status) {
            case "allResourcesUnavailable":
                log.error("Все векторные таблицы НЕ могут быть выгружены. Останавливаем ветку экспорта вектора.");
                reportManager.errorAllTablesInReport(rabbitDto, event.getGpkgReport());

                break;
            case "geoWrapperError":
                log.warn("Произошла неожиданная ошибка при работе geo-wrapper с векторными таблицами." +
                                 " Останавливаем ветку экспорта вектора.");
                reportManager.errorAllTablesInReport(rabbitDto, event.getGpkgReport());

                break;
            case "geoserverDontReturnInfo":
                log.warn("Geoserver не вернул информацию о стилях. Пробуем записать всю возможную информацию в gpkg.");
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allVectorIsDone");
                break;
            default:
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allVectorIsDone");
        }

        //Негативные сценарии мы покрыли в switch
        //Тут же можно детализировать и покрыть случае неожиданных Error насытить дополнительно отчёт и т.д.
        //Такой вот вспомогательный делегат для записи негатива в отчёт.
        //Основная идея в том что мы всё равно идём по процессу дальше потому что у нас есть растры
    }
}
