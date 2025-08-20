package ru.mycrg.mediator.exceptions;

import ru.mycrg.mediator.IRequest;

public class RequestHandlerNotFoundException extends RuntimeException {

    private final String requestClass;

    public RequestHandlerNotFoundException(IRequest<?> request) {
        this.requestClass = request.getClass().getSimpleName();
    }

    @Override
    public String getMessage() {
        return "Cannot find a matching handler for " + requestClass + " request";
    }
}
