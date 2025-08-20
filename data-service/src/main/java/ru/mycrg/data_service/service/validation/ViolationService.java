package ru.mycrg.data_service.service.validation;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.ExportResourceModel;
import ru.mycrg.data_service.dto.ValidationInfo;
import ru.mycrg.data_service.dto.ValidationRequestDto;
import ru.mycrg.data_service.dto.ValidationResponseDto;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service_contract.dto.ObjectValidationResult;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

@Service
public class ViolationService {

    private final Logger log = LoggerFactory.getLogger(ViolationService.class);

    private final JdbcTemplate jdbcTemplate;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public ViolationService(JdbcTemplate jdbcTemplate,
                            SchemasAndTablesRepository schemasAndTablesRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    public synchronized ValidationResponseDto getViolations(ExportResourceModel resource, int pIndex, int pSize) {
        final String tIdentifier = resource.getTable();
        SchemasAndTables table = schemasAndTablesRepository
                .findByIdentifier(tIdentifier)
                .orElseThrow(() -> new NotFoundException("Не найдена таблица: " + tIdentifier));

        if (table.getSchema() == null) {
            throw new NotFoundException("Не найдена схема таблицы: " + tIdentifier);
        }

        ValidationResponseDto response = new ValidationResponseDto();
        try {
            final String dataset = resource.getDataset();

            Long totalViolations = countTotalViolations(jdbcTemplate, dataset, tIdentifier);
            if (totalViolations > 0) {
                List<Map<String, Object>> violations = getViolations(jdbcTemplate, dataset, tIdentifier, pSize, pIndex);

                log.info("Found {} violations", violations.size());
                response.setResults(mapToViolations(violations));
                response.setValidated(isValidated(jdbcTemplate, dataset, tIdentifier));
            }

            response.setTotal(totalViolations);
            response.setStatus(DONE);
        } catch (Exception e) {
            response.setStatus(ERROR);
            response.setError(e.getMessage());

            throw new DataServiceException("Не удалось выбрать результаты валидации", e.getCause());
        }

        return response;
    }

    /**
     * Выборка общей инфы по провалидированным слоям
     *
     * @param request Список слоев {@link ValidationRequestDto}
     *
     * @return list of {@link ValidationInfo}
     */
    public List<ValidationInfo> getShortInfo(ValidationRequestDto request) {
        List<ValidationInfo> result = new ArrayList<>();

        request.getResources().forEach(resourceModel -> {
            ValidationInfo validationInfo = new ValidationInfo();
            try {
                Long totalViolations = countTotalViolations(jdbcTemplate, resourceModel.getDataset(),
                                                            resourceModel.getTable());

                if (totalViolations > 0) {
                    validationInfo.setValidated(true);
                } else {
                    validationInfo.setValidated(
                            isValidated(jdbcTemplate, resourceModel.getDataset(), resourceModel.getTable()));
                }

                validationInfo.setTotalViolations(totalViolations);
                validationInfo.setFeatureName(resourceModel.getTable());
                validationInfo.setStatus(DONE);

                result.add(validationInfo);
            } catch (Exception e) {
                validationInfo.setStatus(ERROR);
                result.add(validationInfo);

                log.warn("Ошибка выборки со слоя: {}", resourceModel);
            }
        });

        return result;
    }

    private List<ObjectValidationResult> mapToViolations(List<Map<String, Object>> violations) throws IOException {
        List<ObjectValidationResult> results = new ArrayList<>();

        int i = 0;
        while (i < violations.size()) {
            String violationsAsString = getViolation(violations.get(i));

            ObjectValidationResult value = mapper.readValue(violationsAsString, ObjectValidationResult.class);

            results.add(value);

            i++;
        }

        return results;
    }

    @NotNull
    private String getViolation(Map<String, Object> stringObjectMap) {
        Object o = stringObjectMap.get("violations");

        return o != null
                ? o.toString()
                : "";
    }

    private Long countTotalViolations(JdbcTemplate jdbcTemplate, String schemaName, String layerName) {
        String sqlRequest = String.format("SELECT count(*) FROM %s.%s where valid is false",
                                          schemaName, getExtTableName(layerName));

        return jdbcTemplate.queryForObject(sqlRequest, Long.class);
    }

    private List<Map<String, Object>> getViolations(JdbcTemplate jdbcTemplate, String schemaName, String layerName,
                                                    int limit, int offset) {
        String sqlRequest = String.format("SELECT * FROM %s.%s where valid is false LIMIT ? OFFSET ?",
                                          schemaName, getExtTableName(layerName));

        return jdbcTemplate.queryForList(sqlRequest, limit, limit * offset);
    }

    public boolean isValidated(JdbcTemplate jdbcTemplate, String schemaName, String layerName) {
        String extensionTableName = getExtTableName(layerName);

        String sqlRequest = String.format("SELECT * FROM %s.%s LIMIT 1", schemaName, extensionTableName);

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sqlRequest);

        log.info("isValidated for table: {} / result: {}", extensionTableName, result.isEmpty());

        return !result.isEmpty();
    }

    @NotNull
    private String getExtTableName(String layerName) {
        return layerName + EXTENSION_POSTFIX;
    }
}
