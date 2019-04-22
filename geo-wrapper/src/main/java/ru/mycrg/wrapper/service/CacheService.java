package ru.mycrg.wrapper.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;

import java.util.ArrayDeque;
import java.util.List;
import java.util.Map;
import java.util.Queue;

import static ru.mycrg.wrapper.dao.DaoProperties.batchSize;

@Service
public class CacheService {

    private static final Logger log = LoggerFactory.getLogger(CacheService.class);

    private final DatasourceFactory datasourceFactory;
    private final BaseDaoService baseDaoService;

    public CacheService(DatasourceFactory datasourceFactory, BaseDaoService baseDaoService) {
        this.datasourceFactory = datasourceFactory;
        this.baseDaoService = baseDaoService;
    }

    public Queue<List<Map<String, Object>>> fetchData(ResourceProjection target) {
        log.debug("Fetch data from: {}", target.toString());

        Queue<List<Map<String, Object>>> queue = new ArrayDeque<>();
        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(target.getDbName());

        int offset = 0;
        while (true) {
            List<Map<String, Object>> batch = baseDaoService.fetchBatch(jdbcTemplate, target, batchSize, offset);
            if (batch.isEmpty()) {
                break;
            }

            queue.offer(batch);

            offset++;
        }

        return queue;
    }

    public Queue<List<Map<String, Object>>> fetchViolations(@NotNull ResourceProjection target) {
        log.debug("Get violations from: {}", target.toString());

        Queue<List<Map<String, Object>>> queue = new ArrayDeque<>();
        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(target.getDbName());

        int offset = 0;
        while (true) {
            List<Map<String, Object>> batch = baseDaoService.fetchViolationsBatch(jdbcTemplate, target, batchSize, offset);
            if (batch.isEmpty()) {
                break;
            }

            queue.offer(batch);

            offset++;
        }

        return queue;
    }

}
