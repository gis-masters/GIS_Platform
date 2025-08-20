package ru.mycrg.data_service.service.processes;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.ProcessDao;
import ru.mycrg.data_service.dto.DetailsModel;
import ru.mycrg.data_service.dto.ProcessModel;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.ProcessRepository;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.enums.ProcessType;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.security.Principal;
import java.sql.SQLException;
import java.util.Optional;

import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

@Service
public class ProcessService {

    private static final Logger log = LoggerFactory.getLogger(ProcessService.class);

    private final ProcessDao processDao;
    private final ProcessRepository processRepository;

    public ProcessService(ProcessRepository processRepository,
                          ProcessDao processDao) {
        this.processDao = processDao;
        this.processRepository = processRepository;
    }

    /**
     * Возвращает страницу {@link Page} сущностей {@link Process} соответствующих ограничениям пользовательских прав,
     * представленных обьектом {@code Principal}; а также пейджингом, который предусмотрен в объекте {@code Pageable}.
     *
     * @param pageable  Pagination information
     * @param principal User claims
     *
     * @return a page of entities
     */
    public Page<Process> findAll(Pageable pageable, Principal principal) {
        return processRepository.findAllByUserName(principal.getName(), pageable);
    }

    @NotNull
    public Process getById(Long id) {
        return processRepository.findById(id)
                                .orElseThrow(() -> new NotFoundException(id));
    }

    public Process getById(Long id, String dbName) {
        Optional<Process> optionalProcess = processDao.findById(id, dbName);
        if (optionalProcess.isPresent()) {
            return optionalProcess.get();
        } else {
            throw new NotFoundException(id);
        }
    }

    public Process create(String userName, String title, ProcessType type, Object payload) {
        final Process newProcess = new Process(userName, title, type, JsonConverter.toJsonNode(payload));

        return processRepository.save(newProcess);
    }

    public void complete(String dbName, Long processId, JsonNode details) {
        try {
            processDao.updateDetailsAndStatus(processId, DONE, dbName, details);

            log.info("Successfully complete process with id {}, details: {} ", processId, details);
        } catch (SQLException e) {
            log.error("Failed to complete process: {}", processId);
        }
    }

    public void complete(String dbName, Process process) {
        processDao.updateStatus(process.getId(), DONE, dbName);

        log.info("Successfully complete process: {} / {}", process.getId(), process.getTitle());
    }

    public void error(String dbName, Long processId, JsonNode details) {
        try {
            processDao.updateDetailsAndStatus(processId, ERROR, dbName, details);
        } catch (SQLException e) {
            log.error("Failed to complete with error process: {}. Reason: {}", processId, e.getMessage(), e.getCause());
        }
    }

    public void error(String dbName, Process process) {
        processDao.updateStatus(process.getId(), ERROR, dbName);

        log.info("Процесс {}: '{}' завершился неудачей", process.getId(), process.getTitle());
    }

    public void addTask(Process process, ProcessModel processModel) {
        try {
            log.debug("Add subStep to process: {}", process.getId());

            String content = "{}";
            if (process.getDetails() != null) {
                content = process.getDetails().toString();
            }

            DetailsModel details = mapper.readValue(content, DetailsModel.class);
            details.addTask(processModel);

            JsonNode jsonNode = JsonConverter.toJsonNode(details);

            process.setDetails(jsonNode);
        } catch (IOException e) {
            log.error("Failed write details to process / Error: {}", e.getMessage());
        }
    }

    @NotNull
    public String getWsUiId(Process process) {
        try {
            JsonNode extra = process.getExtra();
            if (extra == null) {
                throw new IllegalStateException("extra данные не заполнены");
            }

            JsonNode jsonNode;
            if (extra.isValueNode()) {
                jsonNode = mapper.readTree(extra.asText());
            } else {
                jsonNode = mapper.readTree(extra.toString());
            }

            return jsonNode.get("wsUiId").asText();
        } catch (Exception e) {
            throw new DataServiceException("Не удалось получить ws идентификатор UI клиента => " + e.getMessage());
        }
    }
}
