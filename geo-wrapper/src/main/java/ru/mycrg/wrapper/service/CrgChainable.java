package ru.mycrg.wrapper.service;

import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;

public interface CrgChainable<T> {

    /**
     * Задаем следующий и предыдущий обработчик в цепочке.
     *
     * @param nextHandler     Следующий по цепочке обработчик.
     * @param previousHandler Предыдущий обработчик.
     */
    void setHandlers(CrgChainable<T> nextHandler, CrgChainable<T> previousHandler);

    void handle(ImportRequestEvent event, T request);

    void rollback(T request);
}
