package ru.mycrg.wrapper.service.import_;

import org.postgresql.util.PGobject;
import org.springframework.stereotype.Service;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.common_utils.ScriptCalculator;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValueTitleProjection;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.wrapper.service.util.StringDecoder;

import java.math.BigDecimal;
import java.util.*;

import static java.util.Objects.nonNull;
import static ru.mycrg.wrapper.dao.DaoProperties.*;

@Service
public class DataHandler {

    private final CrgScriptEngine crgScriptEngine;
    private final ScriptCalculator scriptCalculator;

    public DataHandler(ScriptCalculator scriptCalculator,
                       CrgScriptEngine crgScriptEngine) {
        this.crgScriptEngine = crgScriptEngine;
        this.scriptCalculator = scriptCalculator;
    }

    /**
     * Обработка подразумевает.
     *
     * <br> Перекодировку строк (Импорт плагин геосервера кодирует в ISO_8859_1)
     * <br> Добавление globalid всем обьектам у которых его нет
     * <br> Просчет калькулируемых полей
     * <br> Установка в null тех значений которые были исковерканы shape форматом
     *
     * @param dbRow  Строка из БД.
     * @param schema Схема данных
     *
     * @return возвращает только те данные что были изменены
     */
    public Map<String, Object> handle(Map<String, Object> dbRow, SchemaDto schema) {
        Map<String, Object> decodedRow = decodeStrings(dbRow);
        decodedRow.remove("crg_b_geometry");

        if (schema.getCalcFiledFunction() != null) {
            Object functionResult = crgScriptEngine.invokeFunction(decodedRow, schema.getCalcFiledFunction());
            ((Map<String, Object>) functionResult).forEach((k, v) -> decodedRow.put(k, v.toString()));
        }

        Map<String, String> propsWithFunctions = getPropertiesWithCalculatedFunctions(schema);

        propsWithFunctions.forEach((key, formula) -> {
            decodedRow.putAll(scriptCalculator.calculate(decodedRow, key, formula));
        });

        decodedRow.forEach((key, value) -> {
            if (GLOBAL_ID.equals(key)) {
                String valueAsString = (String) value;
                if (valueAsString == null || valueAsString.equals("{00000000-0000-0000-0000-000000000000}")) {
                    decodedRow.put(key, UUID.randomUUID());
                }
            }

            if (value instanceof String) {
                Optional<SimplePropertyDto> oProperty = getPropertyByName(schema.getProperties(), key);
                if (oProperty.isPresent() &&
                        oProperty.get().getValueTypeAsEnum().equals(ValueType.CHOICE) &&
                        isNotValueExist(oProperty.get().getEnumerations(), (String) value)) {
                    decodedRow.put(key, NULL_MARKER);
                }
            } else if (value instanceof Integer) {
                // Все атрибуты типа int, у которых значение 0 должны быть заменены на null
                if ((Integer) value == 0) {
                    decodedRow.put(key, NULL_MARKER);
                }
            } else if (value instanceof BigDecimal) {
                // Все атрибуты типа double, у которых значение 0,00 должны быть заменены на null
                if (((BigDecimal) value).compareTo(BigDecimal.ZERO) == 0) {
                    decodedRow.put(key, NULL_MARKER);
                }
            } else if (value instanceof PGobject) {
                // do nothing with geometry
            } else {
                decodedRow.put(key, NULL_MARKER);

                Optional<SimplePropertyDto> oProperty = getPropertyByName(schema.getProperties(), key);
                if (oProperty.isPresent() && ValueType.DATETIME.equals(oProperty.get().getValueTypeAsEnum())) {
                    decodedRow.put(key, value == null ? NULL_MARKER : value);
                }
            }
        });

        decodedRow.computeIfAbsent(PRIMARY_KEY, k -> UUID.randomUUID());

        return decodedRow;
    }

    private boolean isNotValueExist(List<ValueTitleProjection> enumerations, String value) {
        return enumerations.stream().noneMatch(projection -> projection.getValue().equals(value));
    }

    private Map<String, Object> decodeStrings(Map<String, Object> item) {
        Map<String, Object> decodedItem = new HashMap<>();
        item.forEach((key, value) -> {
            if (value instanceof String) {
                String decoded = StringDecoder.decode(String.valueOf(value));
                if (decoded.contains("'")) {
                    decoded = decoded.replace("'", "''");
                }

                decodedItem.put(key, decoded);
            } else {
                decodedItem.put(key, value);
            }
        });

        return decodedItem;
    }

    private static Optional<SimplePropertyDto> getPropertyByName(List<SimplePropertyDto> properties, String name) {
        return properties.stream().filter(sProp -> sProp.getName().equalsIgnoreCase(name)).findFirst();
    }

    private static Map<String, String> getPropertiesWithCalculatedFunctions(SchemaDto schema) {
        Map<String, String> propsWithFunctions = new HashMap<>();
        schema.getProperties().forEach(simplePropertyDto -> {
            if (nonNull(simplePropertyDto.getCalculatedValueFormula())) {
                propsWithFunctions.put(simplePropertyDto.getName().toLowerCase(),
                                       simplePropertyDto.getCalculatedValueFormula());
            }
        });

        return propsWithFunctions;
    }
}
