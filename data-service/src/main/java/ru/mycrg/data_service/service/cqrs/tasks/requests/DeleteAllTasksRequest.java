package ru.mycrg.data_service.service.cqrs.tasks.requests;

import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

public class DeleteAllTasksRequest implements IRequest<Voidy> {

    @Override
    public String getType() {
        return DeleteAllTasksRequest.class.getSimpleName();
    }
}
