package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.import_.ImportFeature;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DaoProperties;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.queue.MqSender;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static ru.mycrg.common.enums.ProcessStatus.SUB_ERROR;
import static ru.mycrg.wrapper.dao.DaoProperties.GLOBAL_ID;
import static ru.mycrg.wrapper.dao.DaoProperties.OBJECT_ID;

@Service
public class ImportService {

    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    private final MqSender mqSender;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    public ImportService(BaseDaoService baseDaoService,
                         MqSender mqSender,
                         DatasourceFactory datasourceFactory) {
        this.mqSender = mqSender;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    /**
     * При импорте выполняется:
     * - Очистка целевой таблицы и таблицы с данными валидации (*_extension)
     * - Сам импорт
     * - Проверка и при необходимости генерация GLOBALID
     */
    void doImport(ImportFeature feature, BaseMqProcessRequest mqRequest) {
        log.debug("Start import from: {} to: {}", feature.printSource(), feature.printTarget());

        try {
            String sourceDbName = feature.getSourceResource().getDbName();
            String targetTableName = feature.getTargetResource().getTableName();
            String targetSchemaName = feature.getTargetResource().getSchemaName();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            List<ResourceProjection> targetResource = Collections.singletonList(
                    new ResourceProjection(sourceDbName, targetSchemaName, targetTableName));

            baseDaoService.truncate(jdbcTemplate, targetResource);
            baseDaoService.copy(jdbcTemplate, feature);
        } catch (Exception e) {
            String msg = String.format("Не удалось перенести данные из: %s в: %s", feature.printSource(),
                    feature.printTarget());

            log.error(msg, e);
            mqSender.send(new BaseMqProcessResponse(mqRequest, new ImportMqResponse(feature), SUB_ERROR, "Error", msg));
        }
    }

    /**
     * Дополнительная обработка данных слоя.
     */
    void postHandle(ImportFeature feature, BaseMqProcessRequest mqRequest) {
        try {
            String sourceDbName = feature.getSourceResource().getDbName();
            String targetTableName = feature.getTargetResource().getTableName();
            String targetSchemaName = feature.getTargetResource().getSchemaName();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            log.debug("start postHandle");

            ResourceProjection resourceProjection = new ResourceProjection(null, targetSchemaName, targetTableName);

            int offset = 0;
            while (true) {
                // Выбираем
                List<Map<String, Object>> batch = baseDaoService.fetchBatch(
                        jdbcTemplate, resourceProjection, OBJECT_ID, DaoProperties.BATCH_SIZE, offset);
                if (batch.isEmpty()) {
                    break;
                }

                // Обрабатываем
                List<Map<String, Object>> touchedParams = handleBatch(batch);

                // Сохраняем
                baseDaoService.updateBatch(jdbcTemplate, resourceProjection, touchedParams);

                offset++;
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось перенести данные из: %s в: %s", feature.printSource(),
                    feature.printTarget());

            log.error(msg, e);
            mqSender.send(new BaseMqProcessResponse(mqRequest, new ImportMqResponse(feature), SUB_ERROR, "Error", msg));
        }
    }

    long calculateTotalRows(List<ImportFeature> importFeatures) {
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
     *
     * @param batch        Пачка строк из БД
     * @return В результате обработки верну такую же структуру данных но с колонками которые были затронуты в ходе
     * обработки, дабы не обновлять то что не изменилось.
     */
    private List<Map<String, Object>> handleBatch(List<Map<String, Object>> batch) {
        List<Map<String, Object>> result = new ArrayList<>();

        batch.forEach(item -> {
            HashMap<String, Object> params = new HashMap<>();

            item.forEach((key, value) -> {
                // Добавим чтобы опираться не него при вставке
                if (OBJECT_ID.equals(key)) {
                    params.put(key, value);
                } else if (GLOBAL_ID.equals(key)) {
                    // Генерируем globalid если его нет
                    String valueAsString = (String) value;
                    if (valueAsString == null || valueAsString.equals("{00000000-0000-0000-0000-000000000000}")) {
                        params.put(key, UUID.randomUUID());
                    }
                } else {
                    // Декодируем строковые атрибуты
                    if (value instanceof String) {
                        String decoded =
                                new String(((String) value).getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
                        params.put(key, decoded);
                    } else if (value instanceof Integer) {
                        // Все атрибуты типа int, у которых значение 0 должны быть заменены на null
                        if ((Integer) value == 0) {
                            params.put(key, DaoProperties.NULL_MARKER);
                        }
                    } else if (value instanceof BigDecimal) {
                        // Все атрибуты типа double, у которых значение 0,00 должны быть заменены на null
                        if (((BigDecimal) value).compareTo(BigDecimal.ZERO) == 0) {
                            params.put(key, DaoProperties.NULL_MARKER);
                        }
                    }
                }
            });

            result.add(params);
        });

        return result;
    }
}
