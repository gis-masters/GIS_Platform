package ru.mycrg.wrapper.service.import_;

import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.wrapper.service.CrgChainable;

public abstract class AbstractImportChainItem implements CrgChainable<ImportMqTask> {

    private final Logger log = LoggerFactory.getLogger(AbstractImportChainItem.class);

    @Nullable
    CrgChainable<ImportMqTask> nextImporter;

    @Nullable
    CrgChainable<ImportMqTask> previousImporter;

    @Override
    public void setHandlers(CrgChainable<ImportMqTask> nextHandler, CrgChainable<ImportMqTask> previousHandler) {
        this.nextImporter = nextHandler;
        this.previousImporter = previousHandler;
    }

    @Override
    public void rollback(ImportMqTask importTask) {
        log.info("Rollback. Nothing to do on the step: {}", this.getClass().getName());

        if (previousImporter != null) {
            previousImporter.rollback(importTask);
        }
    }

}
