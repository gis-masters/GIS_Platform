package ru.mycrg.wrapper.service.import_;

import org.jetbrains.annotations.Nullable;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.wrapper.service.CrgChainable;

public abstract class AbstractImportChainItem implements CrgChainable<ImportMqTask> {

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
        if (previousImporter != null) {
            previousImporter.rollback(importTask);
        }
    }

}
