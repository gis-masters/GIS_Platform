package ru.mycrg.wrapper.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.import_.ImportMqProcessRequest;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;

import java.nio.charset.StandardCharsets;
import java.util.*;

import static ru.mycrg.wrapper.dao.DaoProperties.batchSize;

@Service
public class ImportService {

    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    public ImportService(BaseDaoService baseDaoService,
                         DatasourceFactory datasourceFactory) {
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    /**
     * При импорте выполняется:
     * - Очистка целевой таблицы и таблицы с данными валидации (*_extension)
     * - Сам импорт
     * - Проверка и при необходимости генерация GLOBALID
     */
    @Transactional
    public void doImport(ImportMqProcessRequest request) {
        log.debug("Start import from: {} to: {}", request.printSource(), request.printTarget());

        String sourceDbName = request.getSourceResource().getDbName();
        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

        String tableName = request.getTargetResource().getTableName();
        String schemaName = request.getTargetResource().getSchemaName();

        baseDaoService.truncate(jdbcTemplate,
                Collections.singletonList(new ResourceProjection(sourceDbName, schemaName, tableName)));
        baseDaoService.doImport(jdbcTemplate, request);

        // GlobalId and encoding
        log.debug("start encoding");
        ResourceProjection resourceProjection = new ResourceProjection(null, schemaName, tableName);

        Queue<List<Map<String, Object>>> queue = new ArrayDeque<>();
        int offset = 0;
        while (true) {
            List<Map<String, Object>> batch =
                    baseDaoService.fetchBatch(jdbcTemplate, resourceProjection, batchSize, offset);
            if (batch.isEmpty()) {
                break;
            }

            List<Map<String, Object>> touchedParams = handleBatch(batch);

            queue.offer(touchedParams);

            offset++;
        }

        // Вставляю сюда очередь, и обрабатываю сформированные данные позже, потому как чтение происходит быстрее а
        // запись медленее, и если читать пачку из базы -> сразу обрабатывать -> пытаться записать то половина данных
        // пропадает. Так как новые данные приходят быстро и перетерают старые.
        // Кроме того выборка и обработка кусочками дает возможность отсылать оперативную инфу по прогрессу.
        while (true) {
            List<Map<String, Object>> nextBatch = queue.poll();
            if (nextBatch != null) {
                baseDaoService.updateBatch(jdbcTemplate, resourceProjection, nextBatch);
            } else {
                break;
            }
        }

        log.debug("end encoding");
    }

    /**
     * Импорт плагин геосервера кодирует в ISO_8859_1. Поэтому есть необходимость разкодировать обратно
     * Попутно есть желание проставить globalid всем обьектам у которых его нет
     * @param batch Пачка строк из БД
     * @return В результате обработки верну такую же структуру данных но с колонками которые были затронуты в ходе
     * обработки, дабы не обновлять то что не изменилось.
     */
    private List<Map<String, Object>> handleBatch(List<Map<String, Object>> batch) {
        List<Map<String, Object>> result = new ArrayList<>();

        batch.forEach(item -> {
            HashMap<String, Object> params = new HashMap<>();

            item.forEach((key, value) -> {
                // Добавим чтобы опираться не него при вставке
                if ("objectid".equals(key)) {
                    params.put(key, value);
                }

                if ("globalid".equals(key)) {
                    String valueAsString = (String) value;
                    if (valueAsString == null) {
                        params.put(key, UUID.randomUUID());
                    }
                }

                if (value instanceof String) {
                    String decoded =
                            new String(((String) value).getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
                    params.put(key, decoded);
                }
            });

            result.add(params);
        });

        return result;
    }

}
