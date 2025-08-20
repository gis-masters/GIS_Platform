package ru.mycrg.mediator.supplier;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.function.BiFunction;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toCollection;

public class StreamEx<T> {

    private final Stream<T> stream;

    StreamEx(Stream<T> stream) {
        this.stream = stream;
    }

    public <U> U foldRight(U seed, BiFunction<? super T, U, U> accumulator) {
        Iterator<T> iterator = stream.collect(toCollection(LinkedList::new)).descendingIterator();

        U result = seed;
        while (iterator.hasNext()) {
            T element = iterator.next();
            result = accumulator.apply(element, result);
        }

        return result;
    }
}
