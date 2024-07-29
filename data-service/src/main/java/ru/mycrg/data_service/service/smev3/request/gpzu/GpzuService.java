package ru.mycrg.data_service.service.smev3.request.gpzu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.gpzu_1_0_4.QueryResult;
import ru.mycrg.data_service.gpzu_1_0_4.RequestType;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.data_service.service.TaskService.*;
import static ru.mycrg.data_service.service.TaskService.TASK_DESCRIPTION_PROPERTY;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CONTENT_TYPE_ID;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_AT;
import static ru.mycrg.data_service_contract.enums.TaskType.CUSTOM;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class GpzuService {

    private static final Logger log = LoggerFactory.getLogger(GpzuService.class);
    private static final String GPZU_CONTENT_TYPE = "gpzu_smev_rostelekom";
    private static final String STATUS_PROPERTY = "status";

    @Value("${crg-options.taskDb}")
    private String dbName;
    private final TaskLogService taskLogService;
    private final TasksDetachedDao tasksDao;
    private final SmevMessageService smevMessageService;

    public GpzuService(TaskLogService taskLogService,
                       TasksDetachedDao tasksDao,
                       SmevMessageService smevMessageService) {
        this.taskLogService = taskLogService;
        this.tasksDao = tasksDao;
        this.smevMessageService = smevMessageService;
    }

    public void acceptGpzuRequest(String body) {
        QueryResult queryResult;
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(QueryResult.class);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            queryResult = (QueryResult) unmarshaller.unmarshal(new ByteArrayInputStream(body.getBytes(
                    StandardCharsets.UTF_8)));
        } catch (JAXBException ex) {
            log.error("Не удалось распарсить сообщение: {}", body);
            throw new BadRequestException("Не удалось распарсить сообщение: " + body);
        }
        RequestType request = queryResult.getMessage()
                .getRequestContent().getContent().getMessagePrimaryContent().getRequest();
        smevMessageService.saveIncoming(body);
        long taskId = tasksDao.createTask(dbName,
                                          prepareTaskRecord(String.valueOf(request.getService().getOrderId())));
        createLog("Входящее сообщение ЕПГУ успешно записано в реестр",
                      "Входящее сообщение ЕПГУ успешно записано в реестр",
                      taskId);
    }

    private Map<String, Object> prepareTaskRecord(String description) {
        Map<String, Object> body = new HashMap<>();
        body.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        body.put(TASK_DESCRIPTION_PROPERTY, description);
        body.put(STATUS_PROPERTY, TaskStatus.CREATED.name());
        body.put(CONTENT_TYPE_ID.getName(), GPZU_CONTENT_TYPE);
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(TASK_OWNER_ID_PROPERTY, Long.valueOf("2"));
        body.put(TASK_ASSIGNED_TO_PROPERTY, Long.valueOf("2"));

        return body;
    }

    private void createLog(String eventType, String description, Long taskId) {
        Map<String, Object> propsMap = new HashMap<>();
        propsMap.put(TASK_DESCRIPTION_PROPERTY, description);
        propsMap.put(CONTENT_TYPE_ID.getName(), GPZU_CONTENT_TYPE);
        propsMap.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        propsMap.put(STATUS_PROPERTY, TaskStatus.IN_PROGRESS);
        propsMap.put(TASK_OWNER_ID_PROPERTY, Long.valueOf("2"));

        taskLogService.create(new TaskLogDto(eventType, taskId), propsMap);
    }
}
