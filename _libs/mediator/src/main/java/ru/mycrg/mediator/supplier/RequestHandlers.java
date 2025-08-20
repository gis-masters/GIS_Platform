package ru.mycrg.mediator.supplier;

import ru.mycrg.mediator.IRequestHandler;

import java.util.stream.Stream;

@FunctionalInterface
public interface RequestHandlers {

    Stream<IRequestHandler> supply();
}
