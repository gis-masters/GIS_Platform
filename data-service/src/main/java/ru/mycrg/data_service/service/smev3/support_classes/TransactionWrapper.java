package ru.mycrg.data_service.service.smev3.support_classes;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.no_context_transaction.NoContextTransaction;

import java.util.function.Supplier;

@Component
public class TransactionWrapper {

    @NoContextTransaction(dbProperty = "crg-options.integration.smev3.targetDb")
    public <R> R needTransaction(Supplier<R> supplier) {
        return supplier.get();
    }

    @NoContextTransaction(dbProperty = "crg-options.integration.smev3.targetDb")
    public void needTransaction(Runnable runnable) {
        runnable.run();
    }
}
