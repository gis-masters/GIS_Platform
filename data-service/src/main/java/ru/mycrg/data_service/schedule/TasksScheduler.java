package ru.mycrg.data_service.schedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.concurrent.DelegatingSecurityContextRunnable;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.CancelKptTaskService;
import ru.mycrg.data_service.service.smev3.support_classes.TransactionWrapper;

import static ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService.KPT_CONTENT_TYPE;

@Component
public class TasksScheduler {

    private final Logger log = LoggerFactory.getLogger(TasksScheduler.class);

    private final int deadlineTime; // in hours
    private final int kptDeadlineTime; // in hours
    private final TasksDetachedDao tasksDetachedDao;
    private final String databaseName;
    private final TransactionWrapper contextWrapper;
    private final CancelKptTaskService cancelKptTaskService;

    public TasksScheduler(TasksDetachedDao tasksDetachedDao,
                          Environment environment,
                          TransactionWrapper contextWrapper,
                          CancelKptTaskService cancelKptTaskService) {
        this.tasksDetachedDao = tasksDetachedDao;
        this.contextWrapper = contextWrapper;
        this.cancelKptTaskService = cancelKptTaskService;

        this.databaseName = environment.getRequiredProperty("crg-options.taskDb");
        this.deadlineTime = environment.getRequiredProperty("crg-options.taskDeadlineTime", Integer.class);
        this.kptDeadlineTime = environment.getRequiredProperty("crg-options.kptTaskDeadlineTime", Integer.class);
    }

    @Scheduled(cron = "0 0 * * * *")
    public void closeOldTasks() {
        log.debug("close tasks by deadline: {}", deadlineTime);

        SecurityContext securityContext = SecurityContextHolder.getContext();
        DelegatingSecurityContextRunnable wrappedRunnable = new DelegatingSecurityContextRunnable(() -> {
            try {
                tasksDetachedDao.closeOldTasks(databaseName, deadlineTime, KPT_CONTENT_TYPE);
            } catch (Exception e) {
                String msg = "Не удалось выполнить процесс закрытия старых задач. Причина: " + e.getMessage();
                log.error(msg);
                throw new DataServiceException(msg);
            }
        }, securityContext);

        new Thread(wrappedRunnable).start();
    }

    @Scheduled(cron = "${crg-options.kptTaskJobCron}")
    public void closeOldKptTasks() {
        log.debug("close KPT tasks by deadline: {}", kptDeadlineTime);
        contextWrapper.needTransaction(() -> cancelKptTaskService.cancelOldKptTasks(databaseName, kptDeadlineTime));
    }
}
