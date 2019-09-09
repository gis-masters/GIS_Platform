package ru.mycrg.wrapper.service.projects;

import ru.mycrg.common.BaseMqProcessRequest;

public interface CrgChainable<T> {

    /**
     * Задаем следующий и предыдущий обработчик в цепочке.
     *
     * @param nextHandler     Следующий по цепочке обработчик.
     * @param previousHandler Предыдущий обработчик.
     */
    void setHandlers(CrgChainable<T> nextHandler, CrgChainable<T> previousHandler);

    void handle(BaseMqProcessRequest mqRequest, T request);

    void rollback(T request);

}
