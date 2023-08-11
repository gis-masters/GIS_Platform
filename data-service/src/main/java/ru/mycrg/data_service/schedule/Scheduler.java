package ru.mycrg.data_service.schedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Scheduler {

    private final Logger log = LoggerFactory.getLogger(Scheduler.class);

    private final TasksScheduler taskScheduler;

    public Scheduler(TasksScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void hourlyJob() {
        taskScheduler.closeOldTasks();
    }
}
