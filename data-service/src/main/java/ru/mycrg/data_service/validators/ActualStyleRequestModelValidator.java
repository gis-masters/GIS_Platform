package ru.mycrg.data_service.validators;

import ru.mycrg.data_service.dto.styles.ActualStylesRequestModel;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;

import java.util.List;

import static org.springframework.util.StringUtils.isEmpty;
import static ru.mycrg.data_service.util.EcqlParser.parse;

public class ActualStyleRequestModelValidator {

    public static final String COMMON_MSG = "Argument validation exception";
    public static final String REQUIRED_MSG = "Должно быть заполнено";

    private ActualStyleRequestModelValidator() {
        throw new IllegalStateException("Utility class");
    }

    public static void throwIfNotValid(List<ActualStylesRequestModel> styles) {
        styles.forEach(style -> {
            if (style.getDataset() == null) {
                throw new BadRequestException(COMMON_MSG, new ErrorInfo("dataset", REQUIRED_MSG));
            }

            if (style.getIdentifier() == null) {
                throw new BadRequestException(COMMON_MSG, new ErrorInfo("identifier", REQUIRED_MSG));
            }

            if (style.getFilter() == null) {
                throw new BadRequestException(COMMON_MSG, new ErrorInfo("filter", REQUIRED_MSG));
            }

            if (style.getRules() == null) {
                throw new BadRequestException(COMMON_MSG, new ErrorInfo("rules", REQUIRED_MSG));
            }

            if (style.getRules().isEmpty()) {
                throw new BadRequestException(COMMON_MSG,
                                              new ErrorInfo("rules", "Должно присутствовать хотя бы одно правило"));
            }

            String ecqlFilter = style.getEcqlFilter();
            if (!isEmpty(ecqlFilter) && parse(ecqlFilter).isEmpty()) {
                throw new BadRequestException(COMMON_MSG,
                                              new ErrorInfo("ecqlFilter", "Задан некорректный ECQL filter"));
            }
        });
    }
}
