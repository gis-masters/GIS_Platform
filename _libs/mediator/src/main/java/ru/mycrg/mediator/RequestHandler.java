package ru.mycrg.mediator;

public class RequestHandler<Response, Request extends IRequest<Response>> implements IRequestMiddleware.Next<Response> {

    private final Mediator mediator;
    private final Request request;

    public RequestHandler(Mediator mediator, Request request) {
        this.mediator = mediator;
        this.request = request;
    }

    @Override
    public Response invoke() {
        return mediator.getRouter()
                       .route(request)
                       .handle(request);
    }
}
