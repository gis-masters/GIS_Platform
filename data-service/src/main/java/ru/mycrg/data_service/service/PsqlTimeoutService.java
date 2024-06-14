package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.core.CoreReadDao;

import java.util.Optional;
import java.util.Timer;
import java.util.TimerTask;
import java.util.function.Supplier;

@Service
public class PsqlTimeoutService {

    private static final Logger log = LoggerFactory.getLogger(PsqlTimeoutService.class);

    private final static Long DEFAULT_TTL = 60_000L;

    private final CoreReadDao coreReadDao;
    private final ThreadLocal<Timer> tlTimer = new ThreadLocal<>();
    private final ThreadLocal<TimerTask> tlTimerTask = new ThreadLocal<>();

    public PsqlTimeoutService(CoreReadDao coreReadDao) {
        this.coreReadDao = coreReadDao;
    }

    /**
     * Запускает Supplier на выполнение с временем по умолчанию.
     *
     * @param sup - код, sql запросы которого нужно ограничить по времени
     * @param <V> - возвращаемый результат
     */
    public <V> V execute(Supplier<V> sup) {
        return execute(DEFAULT_TTL, sup);
    }

    /**
     * Запускает Supplier на выполнение с указанным временным ограничением.
     *
     * @param ttl - время ожидания в милисекундах
     * @param sup - код, sql запросы которого нужно ограничить по времени
     * @param <V> - возвращаемый результат
     */
    public <V> V execute(Long ttl, Supplier<V> sup) {
        Optional<Long> pidOpt = coreReadDao.queryForObject("SELECT pg_backend_pid()", Long.class);
        Long pid = pidOpt.orElseThrow(() -> new RuntimeException("PostgreSQL pid not found"));
        startTimeout(ttl, pid);
        try {
            return sup.get();
        } finally {
            stopTimeout(pid);
        }
    }

    /**
     * Запуск таймера ограничивающего время работы sql запросов.
     *
     * @param ms  - время для ограничения.
     * @param pid - идентификатор postgres процесса, исполняющий запросы
     */
    private void startTimeout(Long ms, Long pid) {
        Timer timer = new Timer();
        TimerTask timerTask = new TimerTask() {

            @Override
            public void run() {
                Optional<String> sqlOpt =
                        coreReadDao.queryForObject("SELECT query FROM pg_stat_activity WHERE pid=" + pid,
                                                   String.class);
                log.warn("Cancel postgresql query for pid {}, SQL: {}", pid, sqlOpt.orElse("---"));
                coreReadDao.execute("SELECT pg_cancel_backend(" + pid + ")");
            }
        };

        tlTimer.set(timer);
        tlTimerTask.set(timerTask);

        log.info("Start postgresql query timeout for pid {}", pid);
        timer.schedule(timerTask, ms);
    }

    /**
     * Остановка таймера ограничивающего время работы sql запроса.
     *
     * @param pid - идентификатор postgres процесса, исполняющий запросы
     */
    private void stopTimeout(Long pid) {
        log.info("Stop postgresql query timeout for pid {}", pid);
        tlTimerTask.get().cancel();
        tlTimerTask.remove();
        tlTimer.get().cancel();
        tlTimer.remove();
    }
}
