package ru.mycrg.mediator;

public interface IMediator {

    <Result, R extends IRequest<Result>> Result execute(R request);
}
