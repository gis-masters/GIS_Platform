package ru.mycrg.wrapper.service.import_;

import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.import_.ImportMqTask;

public interface CrgImportChain {

    /**
     * Задаем следующий и предыдущий обработчик в цепочке.
     *
     * @param nextHandler     Следующий по цепочке обработчик.
     * @param previousHandler Предыдущий обработчик.
     */
    void setHandlers(CrgImportChain nextHandler, CrgImportChain previousHandler);

    void handle(BaseMqProcessRequest mqRequest, ImportMqTask importTask);

    void rollback(ImportMqTask importTask);

}
