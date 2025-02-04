package ru.mycrg.mediator;

public interface IRequestHandler<Request extends IRequest<Response>, Response> {

    Response handle(Request request);

    default boolean matches(Request request) {
        Class<?> handlerType = getClass();
        Class<?> requestType = request.getClass();

        return new FirstGenericArgOf(handlerType).isAssignableFrom(requestType);
    }
}
