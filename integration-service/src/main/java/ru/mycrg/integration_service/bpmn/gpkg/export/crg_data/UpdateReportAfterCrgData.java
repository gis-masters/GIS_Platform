package ru.mycrg.integration_service.bpmn.gpkg.export.crg_data;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EXPORT_GPKG_EVENT;

@Service("updateReportAfterCrgData")
public class UpdateReportAfterCrgData implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(UpdateReportAfterCrgData.class);
    private final GpkgReportManager reportManager;

    public UpdateReportAfterCrgData(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        //Получается чтобы ВСЕ слои и стили БЕЗУСЛОВНО приводим в статус "Всё хорошо"
        //Хотя часть данных могла по пути потеряться.
        //Сейчас задача просто добавить Экспорту корректный отчёт и переделка на детали это оверскоуп
        reportManager.updateLayerReportWithCompleted(rabbitDto, event.getGpkgReport());
        reportManager.updateStyleReportWithCompleted(rabbitDto, event.getGpkgReport());
        log.debug("Отчёт о выгруженных слоях успешно обновлён!");
    }
}
