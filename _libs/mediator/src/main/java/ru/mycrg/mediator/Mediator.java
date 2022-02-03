package ru.mycrg.mediator;

import ru.mycrg.mediator.supplier.RequestHandlers;
import ru.mycrg.mediator.supplier.RequestMiddlewares;
import ru.mycrg.mediator.supplier.StreamSupplier;

import static ru.mycrg.mediator.Preconditions.checkArgument;

public class Mediator implements IMediator {

    private final IRouter router = new ToFirstMatching(this);

    private StreamSupplier<IRequestMiddleware> requestMiddlewares;
    private StreamSupplier<IRequestHandler> requestHandlers;

    public Mediator withHandlers(RequestHandlers requestHandlers) {
        checkArgument(requestHandlers, "Request handlers must not be null");

        this.requestHandlers = requestHandlers::supply;

        return this;
    }

    public Mediator withMiddlewares(RequestMiddlewares requestMiddlewares) {
        checkArgument(requestMiddlewares, "Middlewares must not be null");

        this.requestMiddlewares = requestMiddlewares::supply;

        return this;
    }

    @Override
    public <Response, Request extends IRequest<Response>> Response execute(Request request) {
        IRequestMiddleware.Next<Response> handleRequest = new HandleRequest<>(this, request);

        return requestMiddlewares.supplyEx()
                                 .foldRight(handleRequest, (step, next) -> () -> step.invoke(request, next))
                                 .invoke();
    }

    public IRouter getRouter() {
        return this.router;
    }

    public StreamSupplier<IRequestMiddleware> getRequestMiddlewares() {
        return requestMiddlewares;
    }

    public StreamSupplier<IRequestHandler> getRequestHandlers() {
        return requestHandlers;
    }
}
