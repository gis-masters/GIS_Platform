package ru.mycrg.mediator;

public class HandleRequest<Response, Request extends IRequest<Response>> implements IRequestMiddleware.Next<Response> {

    private final Mediator mediator;
    private final Request request;

    HandleRequest(Mediator mediator, Request request) {
        this.mediator = mediator;
        this.request = request;
    }

    @Override
    public Response invoke() {
        IRequestHandler<Request, Response> handler = mediator.getRouter().route(request);

        return handler.handle(request);
    }
}
