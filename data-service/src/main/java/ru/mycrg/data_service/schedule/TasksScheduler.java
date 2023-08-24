package ru.mycrg.data_service.schedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.concurrent.DelegatingSecurityContextRunnable;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.exceptions.DataServiceException;

@Component
public class TasksScheduler {

    private final Logger log = LoggerFactory.getLogger(TasksScheduler.class);

    private final int DEADLINE_TIME = 5; // in hours

    private final TasksDetachedDao tasksDetachedDao;

    public TasksScheduler(TasksDetachedDao tasksDetachedDao) {
        this.tasksDetachedDao = tasksDetachedDao;
    }

    public void closeOldTasks() {
        log.debug("close tasks by deadline: {}", DEADLINE_TIME);

        try {
            SecurityContext securityContext = SecurityContextHolder.getContext();
            DelegatingSecurityContextRunnable wrappedRunnable = new DelegatingSecurityContextRunnable(() -> {
                tasksDetachedDao.closeOldTasks(1L, DEADLINE_TIME);
            }, securityContext);
            new Thread(wrappedRunnable).start();
        } catch (Exception e) {
            String msg = "Не удалось выполнить процесс закрытия старых задач. Причина: " + e.getMessage();
            log.error(msg);
            throw new DataServiceException(msg);
        }
    }
}
