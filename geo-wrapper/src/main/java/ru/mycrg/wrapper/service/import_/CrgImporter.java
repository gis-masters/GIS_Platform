package ru.mycrg.wrapper.service.import_;

import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.wrapper.exceptions.CrgImportException;

public interface CrgImporter {

    /**
     * Задаем следующий и предыдущий обработчик в цепочке.
     *
     * @param nextImporter     Обработчик следующий по цепочке.
     * @param previousImporter Обработчик предыдущий.
     */
    void setHandlers(CrgImporter nextImporter, CrgImporter previousImporter);

    void doImport(ImportMqTask importTask) throws CrgImportException;

    void rollback(ImportMqTask importTask);

}
