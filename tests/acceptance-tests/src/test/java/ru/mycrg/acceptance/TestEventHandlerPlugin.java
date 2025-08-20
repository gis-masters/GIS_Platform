package ru.mycrg.acceptance;

import io.cucumber.plugin.ConcurrentEventListener;
import io.cucumber.plugin.event.EventPublisher;
import io.cucumber.plugin.event.TestRunFinished;

import static ru.mycrg.acceptance.auth_service.AuthorizationBase.authCacheUsedCounter;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.authCounter;

/**
 * Используется в RunCucumberTest -> CucumberOptions
 */
public class TestEventHandlerPlugin implements ConcurrentEventListener {

    @Override
    public void setEventPublisher(EventPublisher eventPublisher) {
        eventPublisher.registerHandlerFor(TestRunFinished.class, allTestsFinished -> {
            System.out.println("===========================================");
            System.out.println("===========================================");
            System.out.println("===========================================");

            System.out.println("authCounter: " + authCounter);
            System.out.println("authCacheUsedCounter: " + authCacheUsedCounter);

            System.out.println("===========================================");
            System.out.println("===========================================");
            System.out.println("===========================================");
        });
    }
}
