package ru.mycrg.mediator.supplier;

import ru.mycrg.mediator.IRequestMiddleware;

import java.util.stream.Stream;

@FunctionalInterface
public interface RequestMiddlewares {

    Stream<IRequestMiddleware> supply();
}
