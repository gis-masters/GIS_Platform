package ru.mycrg.data_service.no_context_transaction;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

import static java.util.Optional.ofNullable;

@Aspect
@Component
public class NoContextTransactionAspect {

    private final Logger log = LoggerFactory.getLogger(NoContextTransactionAspect.class);

    public static ConcurrentHashMap<Thread, String> threadDbConnections = new ConcurrentHashMap<>();
    private final Environment env;

    public NoContextTransactionAspect(Environment env) {
        this.env = env;
    }

    @Before(value = "@annotation(ru.mycrg.data_service.no_context_transaction.NoContextTransaction)")
    void before(JoinPoint joinPoint) {
        ofNullable(getDb(joinPoint))
                .map(NoContextTransaction::dbProperty)
                .map(env::getProperty)
                .ifPresent(db -> {
                    log.debug("add db to connection {}", db);
                    threadDbConnections.putIfAbsent(Thread.currentThread(), db);
                });
    }

    @SuppressWarnings("PMD.UnusedFormalParameter")
    @AfterReturning(value = "@annotation(ru.mycrg.data_service.no_context_transaction.NoContextTransaction)",
                    returning = "f")
    void after(JoinPoint joinPoint, Object f) {
        if (threadDbConnections.get(Thread.currentThread()) != null) {
            threadDbConnections.remove(Thread.currentThread());
        }
    }

    @SuppressWarnings("PMD.UnusedFormalParameter")
    @AfterThrowing(value = "@annotation(ru.mycrg.data_service.no_context_transaction.NoContextTransaction)",
                   throwing = "ex")
    void throwing(JoinPoint joinPoint, Exception ex) {
        if (threadDbConnections.get(Thread.currentThread()) != null) {
            threadDbConnections.remove(Thread.currentThread());
        }
    }

    private NoContextTransaction getDb(JoinPoint joinPoint) {
        var signature = (MethodSignature) joinPoint.getSignature();
        var method = signature.getMethod();
        return method.getAnnotation(NoContextTransaction.class);
    }
}
