package ru.mycrg.wrapper.service.projects;

import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.OrgMqProcessRequest;

public interface CrgProjectChain {

    /**
     * Задаем следующий и предыдущий обработчик в цепочке.
     *
     * @param nextHandler     Следующий по цепочке обработчик.
     * @param previousHandler Предыдущий обработчик.
     */
    void setHandlers(CrgProjectChain nextHandler, CrgProjectChain previousHandler);

    void handle(BaseMqProcessRequest mqRequest, OrgMqProcessRequest request);

    void rollback(OrgMqProcessRequest request);

}
