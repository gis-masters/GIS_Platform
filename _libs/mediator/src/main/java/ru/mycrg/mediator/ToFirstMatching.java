package ru.mycrg.mediator;

import ru.mycrg.mediator.exceptions.RequestHandlerNotFoundException;
import ru.mycrg.mediator.exceptions.RequestHasMultipleHandlersException;

import java.util.List;

import static java.util.stream.Collectors.toList;

class ToFirstMatching implements IRouter {

    private final Mediator mediator;

    public ToFirstMatching(Mediator mediator) {
        this.mediator = mediator;
    }

    @Override
    public <Request extends IRequest<Response>, Response> IRequestHandler<Request, Response> route(Request request) {
        List<IRequestHandler> matchingHandlers = mediator.getRequestHandlers().supply()
                                                         .filter(handler -> handler.matches(request))
                                                         .collect(toList());

        boolean noMatches = matchingHandlers.isEmpty();
        if (noMatches) {
            throw new RequestHandlerNotFoundException(request);
        }

        boolean moreThanOneMatch = matchingHandlers.size() > 1;
        if (moreThanOneMatch) {
            throw new RequestHasMultipleHandlersException(request, matchingHandlers);
        }

        return matchingHandlers.get(0);
    }
}
