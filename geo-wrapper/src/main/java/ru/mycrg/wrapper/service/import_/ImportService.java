package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.import_.ImportFeature;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.queue.MqSender;

import java.nio.charset.StandardCharsets;
import java.util.*;

import static ru.mycrg.common.enums.ProcessStatus.*;
import static ru.mycrg.wrapper.dao.DaoProperties.batchSize;

@Service
public class ImportService {

    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    private final MqSender mqSender;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    private int totalRows = 0;
    private int processedRows = 0;

    public ImportService(BaseDaoService baseDaoService,
                         MqSender mqSender,
                         DatasourceFactory datasourceFactory) {
        this.mqSender = mqSender;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    public void doImport(BaseMqProcessRequest mqRequest) {
        ImportMqRequest payload = (ImportMqRequest) mqRequest.getPayload();

        log.debug("Start import");

        totalRows = (int) calculateTotalRows(payload.getImportFeatures());

        mqSender.send(new BaseMqProcessResponse(mqRequest, PENDING, "Инициализация", 0));

        payload
                .getImportFeatures()
                .forEach(feature -> importFeature(mqRequest, feature, processedRows));


        mqSender.send(new BaseMqProcessResponse(mqRequest, DONE, "Импорт завершен", 100));
    }

    /**
     * При импорте выполняется:
     * - Очистка целевой таблицы и таблицы с данными валидации (*_extension)
     * - Сам импорт
     * - Проверка и при необходимости генерация GLOBALID
     */
    private void importFeature(BaseMqProcessRequest mqRequest, ImportFeature feature, int processedRows) {
        log.debug("Start import from: {} to: {}", feature.printSource(), feature.printTarget());

        String targetTable = feature.getTargetResource().getTableName();
        try {
            String sourceDbName = feature.getSourceResource().getDbName();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            String schemaName = feature.getTargetResource().getSchemaName();

            baseDaoService.truncate(jdbcTemplate,
                    Collections.singletonList(new ResourceProjection(sourceDbName, schemaName, targetTable)));
            baseDaoService.doImport(jdbcTemplate, feature);

            // GlobalId and encoding
            log.debug("start encoding");
            ResourceProjection resourceProjection = new ResourceProjection(null, schemaName, targetTable);

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

            mqSender.send(new BaseMqProcessResponse(mqRequest, new ImportMqResponse(feature), SUB_DONE, "Success", 0));
        } catch (Exception e) {
            String msg = String.format("Не удалось импортировать из: %s в: %s",
                    feature.printSource(), feature.printTarget());

            log.error(msg, e);
            mqSender.send(new BaseMqProcessResponse(mqRequest, new ImportMqResponse(feature), SUB_ERROR, "Error", msg));
        }
    }

    private long calculateTotalRows(List<ImportFeature> importFeatures) {
        return importFeatures.stream()
                .map(importFeature -> {
                    ResourceProjection source = importFeature.getSourceResource();
                    return new ResourceProjection(source.getDbName(), source.getSchemaName(), source.getTableName());
                })
                .mapToLong(baseDaoService::countTotalRows)
                .sum();
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

                if (value instanceof String) {
                    String decoded =
                            new String(((String) value).getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
                    params.put(key, decoded);
                }

                if ("globalid".equals(key)) {
                    String valueAsString = (String) value;
                    if (valueAsString == null || valueAsString.equals("{00000000-0000-0000-0000-000000000000}")) {
                        params.put(key, UUID.randomUUID());
                    }
                }
            });

            result.add(params);
        });

        return result;
    }

}
