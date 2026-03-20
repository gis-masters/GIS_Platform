package ru.mycrg.acceptance.report_service;

import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;
import ru.mycrg.common_contracts.generated.report_service.ReportOutputFormat;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.common_contracts.generated.report_service.ReportOutputFormat.DOCX;
import static ru.mycrg.common_contracts.generated.report_service.ReportOutputFormat.PDF;

public class ReportRequestBuilder {

    public static final String DEFAULT_SYSTEM_TEMPLATE_NAME = "featureExtractCompact";

    public static ReportMainDto prepareReport(String dataTemplate) {
        switch (dataTemplate) {
            case "PDF":
            case DEFAULT_SYSTEM_TEMPLATE_NAME:
                return createPdfReport();

            case "DOCX":
            case "JPEG":
            case "ODT":
                return createReportCustomExtension(dataTemplate);

            case "test pictures in arrays":
                return createHardData(dataTemplate);

            case "Пустой запрос":
                return new ReportMainDto();

            case "Пустой outputFormat":
                return emptyOutputFormat();

            case "Пустые поля media и data":
                return emptyMediaAndData();

            case "user template":
            case "featureExtractFull":
                ReportMainDto dto = createPdfReport();
                dto.setTemplateName(dataTemplate);
                dto.setOutputFormat(DOCX);

                return dto;
        }
        throw new IllegalArgumentException("В тестах нет шаблона отчёта для " + dataTemplate);
    }

    private static ReportMainDto createHardData(String dataTemplate) {
        String firstPicture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAATBAMAAADIYfY6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURSaL/xJFf31/fvz//bowRv8oL4WYM94AAAAJcEhZcwAADsIAAA7CARUoSoAAAAAaSURBVCjPY0AAIWNUoBKKAKPKRpUNVWWhoQDgIYIviVUrYwAAAABJRU5ErkJggg==";
        String secondPicture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAATBAMAAADIYfY6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURQAAAAUUJLpCUf9CP7rGXP/8T1mvjq8AAAAJcEhZcwAADsIAAA7CARUoSoAAAAAqSURBVCjPYxjMQJAoQKxpSkQBBmOiwKBWRqRPiQQuRAGGUKLAACgLDQUAS1ZvCecNXnEAAAAASUVORK5CYII=";
        String thirdPicture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAATBAMAAADIYfY6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAnUExURUT/YzXJawAAALjG2fz8/2trbZQsQf81QoEiMG8YHm0WHHh8g3+Gj9IufucAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAqSURBVCjPY4ABIRMXVOCaXo4AQ1RZ+9BXNp04ZcsHrzJv4pT50EpZeTkA5yDBvcQ96MsAAAAASUVORK5CYII=";

        Map<String, String> media = new HashMap<>();
        media.put("{%solo%}", firstPicture);

        media.put("{%legend1%}", firstPicture);
        media.put("{%random1%}", firstPicture);
        media.put("{%random2%}", firstPicture);

        media.put("{%legend2%}", secondPicture);
        media.put("{%random3%}", secondPicture);
        media.put("{%random4%}", secondPicture);
        media.put("{%random5%}", secondPicture);
        media.put("{%random6%}", secondPicture);

        media.put("{%legend3%}", thirdPicture);

        Map<String, Object> data = new HashMap<>();
        data.put("attributes", List.of(
                Map.of("pict", "Italy", "label", "{%legend1%}"),
                Map.of("pict", "Germany", "label", "{%legend2%}"),
                Map.of("pict", "France", "label", "{%legend3%}")
        ));

        data.put("nova", List.of(
                Map.of(
                        "pict", "Text once",
                        "models", List.of(
                                Map.of("name", "name 1", "value", "{%random1%}"),
                                Map.of("name", "name 2", "value", "{%random2%}"),
                                Map.of("name", "Special duplication to make the table move apart 1", "value",
                                       "{%random1%}"),
                                Map.of("name", "Special duplication to make the table move apart 2", "value",
                                       "{%random2%}")
                        )
                ),
                Map.of(
                        "pict", "Text two",
                        "models", List.of(
                                Map.of("name", "name 3", "value", "{%random3%}"),
                                Map.of("name", "name 4", "value", "{%random4%}"),
                                Map.of("name", "Special duplication to make the table move apart 3", "value",
                                       "{%random1%}"),
                                Map.of("name", "Special duplication to make the table move apart 4", "value",
                                       "{%random2%}")
                        )
                ),
                Map.of(
                        "pict", "Text three",
                        "models", List.of(
                                Map.of("name", "name 5", "value", "{%random5%}"),
                                Map.of("name", "name 6", "value", "{%random6%}"),
                                Map.of("name", "Special duplication to make the table move apart 5", "value",
                                       "{%random5%}"),
                                Map.of("name", "Special duplication to make the table move apart 6", "value",
                                       "{%random6%}")
                        )
                )
        ));

        return new ReportMainDto(DOCX, dataTemplate, media, data);
    }

    private static ReportMainDto createPdfReport() {
        //просто чёрный квадрат
        String base64Picture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWJiYGD4DwAAAP//cGajQwAAAAZJREFUAwABDgEC81VxbAAAAABJRU5ErkJggg==";
        Map<String, String> media = new HashMap<>() {{
            put("{%map%}", base64Picture);
        }};

        Map<String, Object> data = new HashMap<>(Map.of("header", "jujutsu",
                                                        "date", "01.11.794",
                                                        "crs", "173",
                                                        "map", "{%map%}",
                                                        "attributes", List.of(Map.of("title", "номер",
                                                                                     "value", "itadakimas")),
                                                        "coordinates", List.of(Map.of("num", 1,
                                                                                      "x", 37, "y", 55))));

        return new ReportMainDto(PDF, DEFAULT_SYSTEM_TEMPLATE_NAME, media, data);
    }

    private static ReportMainDto emptyOutputFormat() {
        ReportMainDto dto = createPdfReport();
        dto.setOutputFormat(null);

        return dto;
    }

    private static ReportMainDto createReportCustomExtension(String ext) {
        ReportMainDto dto = createPdfReport();
        dto.setOutputFormat(ReportOutputFormat.valueOf(ext));

        return dto;
    }

    private static ReportMainDto emptyMediaAndData() {
        ReportMainDto dto = createPdfReport();
        dto.setMedia(null);
        dto.setData(null);

        return dto;
    }
}