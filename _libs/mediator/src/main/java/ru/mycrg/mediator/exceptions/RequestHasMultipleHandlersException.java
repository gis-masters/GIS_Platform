package ru.mycrg.mediator.exceptions;

import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.IRequestHandler;

import java.util.Collection;

import static java.util.stream.Collectors.joining;

public class RequestHasMultipleHandlersException extends RuntimeException {

    private final String message;

    public RequestHasMultipleHandlersException(IRequest<?> request,
                                               Collection<IRequestHandler> matchingHandlers) {
        String requestName = request.getClass().getSimpleName();
        String handlerNames = matchingHandlers.stream()
                                              .map(it -> it.getClass().getSimpleName())
                                              .collect(joining(", "));

        this.message = String.format("Request %s must have a single matching handler, but found %d (%s)",
                                     requestName, matchingHandlers.size(), handlerNames);
    }

    @Override
    public String getMessage() {
        return message;
    }
}
