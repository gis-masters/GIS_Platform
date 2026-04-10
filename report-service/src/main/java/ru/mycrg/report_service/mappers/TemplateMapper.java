package ru.mycrg.report_service.mappers;

import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.report_service.TemplateFullInfo;
import ru.mycrg.report_service.entity.Template;

@Component
public class TemplateMapper {

    public static TemplateFullInfo mapToTemplateFullInfo(Template template) {
        return new TemplateFullInfo(template.getName(),
                                    template.getTitle(),
                                    template.getId(),
                                    template.getPrintFormSchemaOverrides(),
                                    template.getCreatedBy(),
                                    String.valueOf(template.getCreatedAt()),
                                    template.isSystem());
    }
}
