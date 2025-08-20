package ru.mycrg.data_service.service.cqrs.fts.requests;

import ru.mycrg.mediator.IRequest;

public class FtsReloadRequest implements IRequest<String> {

    @Override
    public String getType() {
        return FtsReloadRequest.class.getSimpleName();
    }

}
