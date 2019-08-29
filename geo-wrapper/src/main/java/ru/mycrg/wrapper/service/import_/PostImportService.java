package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DaoProperties;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.exceptions.CrgImportException;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.util.CrgScriptEngine;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static ru.mycrg.common.enums.ProcessStatus.TASK_ERROR;
import static ru.mycrg.wrapper.dao.DaoProperties.*;

@Service
public class PostImportService implements CrgImportChain {

    private static final Logger log = LoggerFactory.getLogger(PostImportService.class);

    private CrgImportChain nextImporter;
    private CrgImportChain previousImporter;

    private final MqSender mqSender;
    private final CrgScriptEngine scriptEngine;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    public PostImportService(BaseDaoService baseDaoService,
                             CrgScriptEngine scriptEngine,
                             MqSender mqSender,
                             DatasourceFactory datasourceFactory) {
        this.mqSender = mqSender;
        this.scriptEngine = scriptEngine;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    @Override
    public void setHandlers(CrgImportChain nextHandler, CrgImportChain previousHandler) {
        this.nextImporter = nextHandler;
        this.previousImporter = previousHandler;
    }

    public void handle(BaseMqProcessRequest mqRequest, ImportMqTask importTask) throws CrgImportException {
        log.debug("Start additional handles");

        try {
            String sourceDbName = importTask.getSourceResource().getDbName();
            String targetTableName = importTask.getTargetResource().getTableName();
            String targetSchemaName = importTask.getTargetResource().getSchemaName();
            FeatureDescriptionDto fDescription = importTask.getFeatureDescription();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            log.debug("start postHandle");

            ResourceProjection resProjection = new ResourceProjection(null, targetSchemaName, targetTableName);

            int offset = 0;
            while (true) {
                // Выбираем
                List<Map<String, Object>> batch = baseDaoService.fetchBatch(
                        jdbcTemplate, resProjection, PRIMARY_KEY, DaoProperties.BATCH_SIZE, offset);
                if (batch.isEmpty()) {
                    break;
                }

                // Обрабатываем
                List<Map<String, Object>> touchedParams = handleBatch(batch, fDescription);

                // Сохраняем
                baseDaoService.updateBatch(jdbcTemplate, resProjection, touchedParams);

                offset++;
            }

            nextImporter.handle(mqRequest, importTask);
        } catch (Exception e) {
            String msg = "Не удалось выполнить доп. обработку ресурса: " + importTask.printTarget();
            log.error(msg, e);

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(importTask), TASK_ERROR, "", msg));

            previousImporter.rollback(importTask);
        }
    }

    @Override
    public void rollback(ImportMqTask importTask) {
        previousImporter.rollback(importTask);
    }

    /**
     * Импорт плагин геосервера кодирует в ISO_8859_1. Поэтому есть необходимость разкодировать обратно
     * Попутно есть желание проставить globalid всем обьектам у которых его нет
     *
     * @param batch        Пачка строк из БД
     * @param fDescription Описание фичи
     * @return В результате обработки верну такую же структуру данных но с колонками которые были затронуты в ходе
     * обработки, дабы не обновлять то что не изменилось.
     */
    private List<Map<String, Object>> handleBatch(List<Map<String, Object>> batch, FeatureDescriptionDto fDescription) {
        List<Map<String, Object>> result = new ArrayList<>();

        batch.forEach(item -> {
            HashMap<String, Object> params = new HashMap<>();

            item.forEach((key, value) -> {
                // Добавим чтобы опираться не него при вставке
                if (PRIMARY_KEY.equals(key)) {
                    params.put(key, value);
                } else if (GLOBAL_ID.equals(key)) {
                    // Генерируем globalid если его нет
                    String valueAsString = (String) value;
                    if (valueAsString == null || valueAsString.equals("{00000000-0000-0000-0000-000000000000}")) {
                        params.put(key, UUID.randomUUID());
                    }
                } else if (RULE_ID.equals(key) && fDescription.getCalcFiledFunction() != null) {
                    // вычисляем ruleid
                    Map<String, String> data = scriptEngine.invokeFunction(item, fDescription.getCalcFiledFunction());

                    params.put(key, data.get(RULE_ID));
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
