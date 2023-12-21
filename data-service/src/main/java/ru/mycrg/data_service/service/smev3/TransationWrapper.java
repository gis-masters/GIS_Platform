package ru.mycrg.data_service.service.smev3;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.no_context_transaction.NoContextTransaction;

import java.util.function.Supplier;

@Component
public class TransationWrapper {

    @NoContextTransaction(dbProperty = "crg-options.integration.smev3.targetDb")
    public <R> R needTransaction(Supplier<R> supplier) {
        return supplier.get();
    }

    @NoContextTransaction(dbProperty = "crg-options.integration.smev3.targetDb")
    public void needTransaction(Runnable runnable) {
        runnable.run();
    }
}
