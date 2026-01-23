package ru.mycrg.data_service.service.schemas;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.report_service.TemplateShortProjection;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.ReportClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Класс для проверки схемы, пользователь обязан указывать существующие шаблоны печати в схеме
 */
@Component
public class SchemaPrintingTemplatesValidator {

    private final Logger log = LoggerFactory.getLogger(SchemaPrintingTemplatesValidator.class);

    private final ReportClient reportClient;

    public SchemaPrintingTemplatesValidator(ReportClient reportClient) {
        this.reportClient = reportClient;
    }

    /**
     * Запрашивает у сервиса шаблонов все доступные шаблоны, если всё хорошо либо когда сервис недоступен вернётся
     * пустая коллекция. В другом случае будет содержать список имён шаблонов которые не получилось найти.
     */
    public Set<ErrorInfo> checkTemplateAvailability(List<String> printTemplates) {
        if (printTemplates == null || printTemplates.isEmpty()) {
            return new HashSet<>();
        }

        Set<ErrorInfo> mismatches = new HashSet<>();

        try {
            ResponseModel<List<TemplateShortProjection>> response = reportClient.getAll();

            if (response.isSuccessful()) {
                List<TemplateShortProjection> allTemplates = response.getBody() != null
                        ? response.getBody()
                        : new ArrayList<>();

                List<String> notExistNames = printTemplates
                        .stream()
                        .filter(name -> allTemplates.stream().noneMatch(
                                template -> template.getName()
                                                    .equals(name)))
                        .collect(Collectors.toList());

                for (String notExistName: notExistNames) {
                    mismatches.add(new ErrorInfo(
                            "printTemplates",
                            "Шаблон печати с именем '" + notExistName + "' не существует"
                    ));
                }
            } else {
                //TODO: Кидать жёлтые ошибки, если какие-то http нюансы, когда в UI это появится.
                log.warn("Сервис шаблонов вернул ошибку: {} - {}", response.getCode(), response.getMsg());
            }
        } catch (HttpClientException | MalformedURLException e) {
            log.error("Ошибка при получении шаблонов из report-service", e);

            return mismatches;
        }

        return mismatches;
    }
}
