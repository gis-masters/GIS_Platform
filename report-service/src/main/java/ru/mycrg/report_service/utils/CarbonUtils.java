package ru.mycrg.report_service.utils;

import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;
import ru.mycrg.report_service.dto.CarbonDto;

import static ru.mycrg.http_client.JsonConverter.toJson;

/**
 * Возможно класс расшириться в будущем.
 */

@Component
public class CarbonUtils {

    /**
     * Создаем DTO согласно требованиям Carbone API.
     * <ul>
     * <li>Наш json это 'data'</li>
     * <li>Пока что мы сверх data передаём только 'convertTo'</li>
     * <li>Потом вполне может добавиться ещё полей</li>
     * </ul>
     *
     * @param dto данные для отчёта
     *
     * @return JSON строка для Carbone API
     *
     * @see <a href="https://carbone.io/documentation/developer/http-api/generate-reports.html#output-file-type">Carbone
     * API Documentation</a>
     */
    public static String prepareJsonData(ReportMainDto dto) {
        CarbonDto carbonDto = new CarbonDto(dto.getData(), dto.getOutputFormat().name().toLowerCase());

        return toJson(carbonDto);
    }
}
