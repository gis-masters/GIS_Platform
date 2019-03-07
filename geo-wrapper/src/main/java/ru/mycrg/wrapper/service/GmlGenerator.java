package ru.mycrg.wrapper.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.wrapper.dao.GisStorage;

import java.util.ArrayDeque;
import java.util.List;
import java.util.Map;
import java.util.Queue;

@Service
public class GmlGenerator {

    private static final Logger log = LoggerFactory.getLogger(GmlGenerator.class);

    private final int BATCH_SIZE = 100;

    private Queue<List<Map<String, Object>>> queue = new ArrayDeque<>();

    private final GisStorage gisStorage;

    public GmlGenerator(GisStorage gisStorage) {
        this.gisStorage = gisStorage;
    }

    /**
     * Генерируем GML из указанного источника.
     *
     * @param target Источник данных
     * @return Ссылку на сгенерированный файл
     */
    public String generate(ResourceProjection target) {
        log.debug("Start gml generation");

        JdbcTemplate jdbcTemplate = gisStorage.initConnection(target.getDbName());

        int offset = 0;
        while (true) {
            var batch = gisStorage.fetchBatch(jdbcTemplate, target, BATCH_SIZE, offset);
            if (batch.isEmpty()) {
                break;
            }

            queue.offer(batch);

            offset++;
        }

        return "";
    }
}
