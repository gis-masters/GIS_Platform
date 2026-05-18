package ru.mycrg.report_service.mappers;

import ru.mycrg.common_contracts.generated.report_service.TemplateFullInfo;
import ru.mycrg.report_service.entity.Template;

public final class TemplateMapper {

    private TemplateMapper() {
    }

    public static TemplateFullInfo toFullInfo(Template template) {
        return new TemplateFullInfo(template.getName(),
                                    template.getTitle(),
                                    template.getId(),
                                    template.getPrintFormSchemaOverrides(),
                                    template.getCreatedBy(),
                                    String.valueOf(template.getCreatedAt()),
                                    template.isSystem(),
                                    template.isHidden(),
                                    template.getType());
    }
}
