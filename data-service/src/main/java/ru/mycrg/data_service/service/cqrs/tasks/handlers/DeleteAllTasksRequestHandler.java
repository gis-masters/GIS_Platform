package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseWriteDao;
import ru.mycrg.data_service.service.cqrs.tasks.requests.DeleteAllTasksRequest;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.service.TaskLogService.TASK_LOG_QUALIFIER;
import static ru.mycrg.data_service.service.TaskService.TASK_QUALIFIER;

@Component
public class DeleteAllTasksRequestHandler implements IRequestHandler<DeleteAllTasksRequest, Voidy> {

    private final BaseWriteDao baseDao;

    public DeleteAllTasksRequestHandler(BaseWriteDao baseDao) {
        this.baseDao = baseDao;
    }

    @Override
    public Voidy handle(DeleteAllTasksRequest request) {
        baseDao.removeAllRecords(TASK_LOG_QUALIFIER);
        baseDao.removeAllRecords(TASK_QUALIFIER);

        return new Voidy();
    }
}
