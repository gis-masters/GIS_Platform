package ru.mycrg.data_service.service.processes;

import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.detached.ProcessDao;
import ru.mycrg.data_service.dto.DetailsModel;
import ru.mycrg.data_service.dto.ProcessModel;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.ProcessRepository;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.enums.ProcessType;
import tools.jackson.databind.JsonNode;

import java.sql.SQLException;
import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.http_client.JsonConverter.*;

@Service
public class ProcessService {

    private static final Logger log = LoggerFactory.getLogger(ProcessService.class);

    private final ProcessDao processDao;
    private final ProcessRepository processRepository;
    private final IAuthenticationFacade authenticationFacade;

    public ProcessService(ProcessRepository processRepository,
                          ProcessDao processDao,
                          IAuthenticationFacade authenticationFacade) {
        this.processDao = processDao;
        this.processRepository = processRepository;
        this.authenticationFacade = authenticationFacade;
    }

    /**
     * Возвращает страницу {@link Page} сущностей {@link Process} соответствующих ограничениям пользовательских прав. А
     * также пейджингом, который предусмотрен в объекте {@code Pageable}.
     *
     * @param pageable Pagination information
     *
     * @return a page of entities
     */
    public Page<Process> findAll(Pageable pageable) {
        return processRepository.findAllByUserName(authenticationFacade.getLogin(), pageable);
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

    public Page<Process> findAllByUserWithFilters(ProcessStatus status,
                                                  ProcessType type,
                                                  String title,
                                                  Pageable pageable) {
        return processRepository.findAllByUserWithFilters(status,
                                                          type,
                                                          title,
                                                          authenticationFacade.getLogin(),
                                                          pageable);
    }

    public Process create(String userName, String title, ProcessType type, Object payload) {
        final Process newProcess = new Process(userName, title, type, toJsonNodeSafe(payload));

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
        log.debug("Add subStep to process: {}", process.getId());

        String content = "{}";
        if (process.getDetails() != null) {
            content = process.getDetails().toString();
        }

        DetailsModel details = fromJson(content, DetailsModel.class)
                .orElseThrow(() -> new IllegalStateException("Невозможно конвертировать значение!!!"));
        details.addTask(processModel);

        JsonNode jsonNode = toJsonNode(details);

        process.setDetails(jsonNode);
    }

    @NotNull
    public String getWsUiId(Process process) {
        try {
            JsonNode extra = process.getExtra();
            if (extra == null || extra.isNull()) {
                throw new IllegalStateException("extra данные не заполнены");
            }

            JsonNode jsonNode = extra.isTextual()
                    ? toJsonNodeFromString(extra.asText())
                    : extra;

            JsonNode wsUiIdNode = jsonNode.get("wsUiId");
            if (wsUiIdNode == null || wsUiIdNode.isNull()) {
                throw new IllegalStateException("в extra отсутствует поле wsUiId");
            }

            return wsUiIdNode.asText();
        } catch (Exception e) {
            throw new DataServiceException("Не удалось получить ws идентификатор UI клиента => " + e.getMessage());
        }
    }

    public void updateProcess(Long id, ProcessStatus status, String dbName, JsonNode details) {
        String detailsStr = details.toString();
        String msg = detailsStr.length() > 1200
                ? "Переданные детали процесса слишком большие (" + detailsStr.length() + " символов)"
                : detailsStr;

        log.debug("Обновляем процесс с id '{}', статус: {}, детали: {}", id, status, msg);

        try {
            processDao.updateDetailsAndStatus(id, status, dbName, details);
        } catch (Exception e) {
            throw new DataServiceException("Не удалось обновить процесс. Причина: " + e.getMessage());
        }
    }

    public void updateProcessTitle(Long id, String dbName, String title) {
        log.debug("Устанавливаем {} как title процесса с id {}", title, id);

        try {
            processDao.updateTitle(id, dbName, title);
        } catch (Exception e) {
            throw new DataServiceException("Не удалось обновить процесс. Причина: " + e.getMessage());
        }
    }
}
