package ru.mycrg.data_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.ProcessDao;
import ru.mycrg.data_service.dto.DetailsModel;
import ru.mycrg.data_service.dto.TaskModel;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.mq_queue_contract.Processable;
import ru.mycrg.mq_queue_contract.enums.ProcessType;

import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.ERROR;

@Service
public abstract class BaseProcessService implements Processable {

    private static final Logger log = LoggerFactory.getLogger(BaseProcessService.class);

    private final ProcessDao processDao;

    /**
     * Процесс может обновляется очень часто промежуточными результатами, которые нет смысла сразу гнать в БД.
     */
    private final Set<Process> processesCache = new HashSet<>();

    public BaseProcessService(ProcessDao processDao) {
        this.processDao = processDao;
    }

    protected Process create(String userName, String title, ProcessType type) {
        return processDao.save(new Process(userName, title, type));
    }

    protected Process create(String userName, String title, ProcessType type, Object extra) {
        return processDao.save(new Process(userName, title, type, JsonConverter.toJsonNode(extra)));
    }

    public Process getProcessById(Long id, String dbName) {
        Optional<Process> processFromCache = getProcessFromCache(id);
        if (processFromCache.isPresent()) {
            log.debug("Process {} was get from cache", id);

            return processFromCache.get();
        } else {
            log.debug("Get process {} from DB", id);

            Optional<Process> optionalProcess = processDao.findById(id, dbName);
            if (optionalProcess.isPresent()) {
                processesCache.add(optionalProcess.get());

                return optionalProcess.get();
            } else {
                throw new NotFoundException(id);
            }
        }
    }

    protected void complete(String dbName, Process process) {
        processDao.updateStatus(process.getId(), DONE, dbName);

        log.info("Successfully complete process: {} / {}", process.getId(), process.getTitle());
    }

    protected void error(String dbName, Process process) {
        processDao.updateStatus(process.getId(), ERROR, dbName);

        processesCache.remove(process);
        log.info("Процесс {}: '{}' завершился неудачей", process.getId(), process.getTitle());
    }

    protected void addTask(Process process, TaskModel taskModel) {
        try {
            log.debug("Add task to process: {}", process.getId());

            String content = "{}";
            if (process.getDetails() != null) {
                content = process.getDetails().toString();
            }

            DetailsModel details = mapper.readValue(content, DetailsModel.class);
            details.addTask(taskModel);

            JsonNode jsonNode = JsonConverter.toJsonNode(details);

            process.setDetails(jsonNode);
        } catch (IOException e) {
            log.error("Failed write details to process / Error: {}", e.getMessage());
        }
    }

    @NotNull
    protected String getWsUiId(Process process) {
        try {
            JsonNode extra = process.getExtra();
            if (extra != null) {
                final JsonNode jsonNode = mapper.readTree(extra.asText());

                return jsonNode.get("wsUiId").asText();
            } else {
                throw new DataServiceException("");
            }
        } catch (Exception e) {
            throw new DataServiceException("");
        }
    }

    private Optional<Process> getProcessFromCache(Long id) {
        return processesCache.stream()
                             .filter(process -> process.getId().equals(id))
                             .findFirst();
    }
}
