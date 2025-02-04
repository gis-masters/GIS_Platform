package ru.mycrg.integration_service.bpmn.resource_analyze;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.integration_service.dto.ResourceAnalyzeTask;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.integration_service.bpmn.enums.ResourceAnalyzeProcessVariables.*;

@Service("initAnalyzeDelegate")
public class InitAnalyzeDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(InitAnalyzeDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Instant startTimeOfAnalyze = (Instant) execution.getVariable("START_TIME");
        log.debug("Analyze time from delegate analyzer start: {}", startTimeOfAnalyze);

        List<ResourceAnalyzeTask> tasks = (List<ResourceAnalyzeTask>) execution.getVariable(TASKS.name());
        tasks.forEach(task -> {
            log.debug("Task: '{}' completed: {}, Type: {}, Model: {}",
                      task.getId(), task.isComplete(), task.getResourceType(), task.getAnalyzer().getId());
        });

        Optional<ResourceAnalyzeTask> firstUncompletedTask = tasks.stream()
                                                                  .filter(task -> !task.isComplete())
                                                                  .findFirst();
        if (firstUncompletedTask.isPresent()) {
            execution.setVariable(CURRENT_TASK.name(), firstUncompletedTask.get());
            execution.setVariable(CURRENT_PAGE.name(), 0);
            execution.setVariable(ALL_COMPLETE.name(), false);
        } else {
            execution.setVariable(ALL_COMPLETE.name(), true);
            Instant endOfAllAnalyzers = Instant.now();
            log.debug("Analyze time completed datetime: '{}' Duration in seconds: '{}', in hours: '{}'",
                      endOfAllAnalyzers,
                      Duration.between(startTimeOfAnalyze, endOfAllAnalyzers).getSeconds(),
                      Duration.between(startTimeOfAnalyze, endOfAllAnalyzers).toHours());
        }
    }
}
