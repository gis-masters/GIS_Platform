package ru.mycrg.mediator;

@FunctionalInterface
public interface IRequestMiddleware {

    <Response, Request extends IRequest<Response>> Response invoke(Request request, Next<Response> next);

    interface Next<T> {

        T invoke();
    }
}
