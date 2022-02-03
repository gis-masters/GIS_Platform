package ru.mycrg.mediator;

public interface IRouter {

    <Request extends IRequest<Response>, Response> IRequestHandler<Request, Response> route(Request request);
}
