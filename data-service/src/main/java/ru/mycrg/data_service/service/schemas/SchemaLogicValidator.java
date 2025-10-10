package ru.mycrg.data_service.service.schemas;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.HashSet;
import java.util.Set;

import static java.lang.Boolean.TRUE;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

/**
 * Класс для проверки схемы на логические несоответствия
 */
@Component
public class SchemaLogicValidator {

    private final Logger log = LoggerFactory.getLogger(SchemaLogicValidator.class);

    @NotNull
    public Set<ErrorInfo> validate(@NotNull SchemaDto schema) {
        try {
            Set<ErrorInfo> mismatches = new HashSet<>();

            for (SimplePropertyDto property: schema.getProperties()) {
                boolean isRequired = TRUE.equals(property.isRequired());

                // Правило 1. Свойство не может быть задано одновременно и required и hidden
                if (TRUE.equals(property.isHidden()) && isRequired) {
                    mismatches.add(
                            new ErrorInfo(property.getName(),
                                          "Свойство не может быть задано одновременно и required и hidden"));
                }

                // Правило 2. Свойство не может быть задано одновременно и required и readOnly
                if (TRUE.equals(property.isReadOnly()) && isRequired) {
                    log.warn("Свойство '{}' задано одновременно и required и readOnly", property.getName());

                    // От схемы задач "tasks_schema_v1" попахивает гавницом, поэтому это правило включить пока нельзя.
                    // mismatches.add(
                    //        new ErrorInfo(property.getName(),
                    //                      "Свойство не может быть задано одновременно и required и readOnly"));
                }
            }

            // Правило 3. Только одно поле может быть помечено как asTitle
            long asTitleCounter = schema.getProperties().stream()
                                        .filter(simplePropertyDto -> TRUE.equals(simplePropertyDto.getAsTitle()))
                                        .count();
            if (asTitleCounter > 1) {
                mismatches.add(new ErrorInfo(null, "Только одно поле может быть помечено как asTitle"));
            }

            return mismatches;
        } catch (Exception e) {
            logError("Не удалось проверить схему на логические несоответствия => ", e);

            throw new DataServiceException("Не удалось проверить схему на логические несоответствия");
        }
    }
}
