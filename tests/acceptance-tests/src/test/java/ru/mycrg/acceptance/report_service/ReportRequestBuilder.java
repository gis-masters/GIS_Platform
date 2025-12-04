package ru.mycrg.acceptance.report_service;

import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.common_contracts.generated.report_service.ReportOutputFormat.DOCX;
import static ru.mycrg.common_contracts.generated.report_service.ReportOutputFormat.PDF;

public class ReportRequestBuilder {

    public static ReportMainDto prepareReport(String dataTemplate) {
        switch (dataTemplate) {
            case "pdf":
                return createDefaultReport();

            case "docx":
                return createDocxReport();

            case "Пустой запрос":
                return new ReportMainDto();

            case "Пустой outputFormat":
                return emptyOutputFormat();

            case "Пустые поля media и data":
                return emptyMediaAndData();
        }
        throw new IllegalArgumentException("В тестах нет шаблона отчёта для " + dataTemplate);
    }

    private static ReportMainDto createDefaultReport() {
        //просто чёрный квадрат
        String base64Picture = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axDt44AAAAASUVORK5CYII=";
        Map<String, String> media = new HashMap<>() {{
            put("picture", base64Picture);
        }};

        Map<String, Object> data = new HashMap<>(Map.of("header", "jujutsu",
                                                        "date", "01.11.794",
                                                        "crs", "173",
                                                        "attributes", List.of(Map.of("title", "номер",
                                                                                     "value", "itadakimas")),
                                                        "coordinates", List.of(Map.of("num", 1,
                                                                                      "x", 37, "y", 55))));

        return new ReportMainDto(PDF, media, data);
    }

    private static ReportMainDto emptyOutputFormat() {
        ReportMainDto dto = createDefaultReport();
        dto.setOutputFormat(null);

        return dto;
    }

    private static ReportMainDto createDocxReport() {
        ReportMainDto dto = createDefaultReport();
        dto.setOutputFormat(DOCX);

        return dto;
    }

    private static ReportMainDto emptyMediaAndData() {
        ReportMainDto dto = createDefaultReport();
        dto.setMedia(null);
        dto.setData(null);

        return dto;
    }
}