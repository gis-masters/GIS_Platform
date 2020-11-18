package ru.mycrg.gis.service.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zaxxer.hikari.HikariDataSource;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.config.CrgProperties;
import ru.mycrg.gis.dto.ExportResourceModel;
import ru.mycrg.gis.dto.ValidationInfo;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.exceptions.FailedException;
import ru.mycrg.gis.exceptions.NotFoundException;
import ru.mycrg.gis.service.SchemaService;
import ru.mycrg.mq_queue_contract.ObjectValidationResult;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static ru.mycrg.gis.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.ERROR;

@Service
public class ViolationService {

    private static final Logger log = LoggerFactory.getLogger(ViolationService.class);

    private final SchemaService schemaService;
    private final CrgProperties crgProperties;
    private final ObjectMapper mapper = new ObjectMapper();

    public ViolationService(CrgProperties crgProperties, SchemaService schemaService) {
        this.crgProperties = crgProperties;
        this.schemaService = schemaService;
    }

    public ValidationResponseDto getViolations(ExportResourceModel resource, int pIndex, int pSize, Principal principal)
            throws FailedException {
        long orgId = getOrganizationId(principal);

        if (!schemaService.isSchemaExist(resource.getSchemaId())) {
            throw new NotFoundException(resource.getSchemaId());
        }

        String dbName = DEFAULT_DB_NAME + orgId;
        ValidationResponseDto response = new ValidationResponseDto();
        HikariDataSource datasource = getDatasource(dbName);
        try {
            final String dataset = resource.getDataset();
            final String table = resource.getTable();

            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasource);

            Long totalViolations = countTotalViolations(jdbcTemplate, dataset, table);
            if (totalViolations > 0) {
                List<Map<String, Object>> violations = getViolations(jdbcTemplate, dataset, table, pSize, pIndex);

                log.info("Found {} violations", violations.size());
                response.setResults(mapToViolations(violations));
                response.setValidated(isValidated(jdbcTemplate, dataset, table));
            }

            response.setTotal(totalViolations);
            response.setStatus(DONE);
        } catch (Exception e) {
            log.error("Не удалось выбрать результаты валидации для: {}", resource, e);
            response.setStatus(ERROR);
            response.setError(e.getMessage());

            datasource.close();
            throw new FailedException(e.getMessage());
        }

        datasource.close();
        return response;
    }

    /**
     * Выборка общей инфы по провалидированным слоям
     *
     * @param principal Пользователь
     * @param request   Список слоев {@link ValidationRequestDto}
     *
     * @return list of {@link ValidationInfo}
     */
    public List<ValidationInfo> getShortInfo(ValidationRequestDto request, Principal principal) {
        long orgId = getOrganizationId(principal);

        List<ValidationInfo> result = new ArrayList<>();

        String dbName = DEFAULT_DB_NAME + orgId;
        HikariDataSource datasource = getDatasource(dbName);
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasource);
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

        datasource.close();
        return result;
    }

    private List<ObjectValidationResult> mapToViolations(List<Map<String, Object>> violations) throws IOException {
        List<ObjectValidationResult> results = new ArrayList<>();

        int i = 0;
        while (i < violations.size()) {
            String violationsAsString = getViolations2(violations.get(i), "violations");

            ObjectValidationResult value = mapper.readValue(violationsAsString, ObjectValidationResult.class);

            results.add(value);

            i++;
        }

        return results;
    }

    @NotNull
    private String getViolations2(Map<String, Object> stringObjectMap, String violations_key) {
        Object o = stringObjectMap.get(violations_key);

        return o != null
                ? o.toString()
                : "";
    }

    private Long countTotalViolations(JdbcTemplate jdbcTemplate, String schemaName, String layerName) {
        String extensionTableName = layerName + "_extension";

        String sqlRequest = String.format("SELECT count(*) FROM %s.%s where valid is false",
                                          schemaName, extensionTableName);

        return jdbcTemplate.queryForObject(sqlRequest, Long.class);
    }

    private List<Map<String, Object>> getViolations(JdbcTemplate jdbcTemplate, String schemaName, String layerName,
                                                    int limit, int offset) {
        String extensionTableName = layerName + "_extension";

        String sqlRequest = String.format("SELECT * FROM %s.%s where valid is false LIMIT ? OFFSET ?",
                                          schemaName, extensionTableName);

        return jdbcTemplate.queryForList(sqlRequest, limit, limit * offset);
    }

    public boolean isValidated(JdbcTemplate jdbcTemplate, String schemaName, String layerName) {
        String extensionTableName = layerName + "_extension";

        String sqlRequest = String.format("SELECT * FROM %s.%s LIMIT 1", schemaName, extensionTableName);

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sqlRequest);

        log.info("isValidated for table: {} / result: {}", extensionTableName, result.isEmpty());

        return !result.isEmpty();
    }

    private HikariDataSource getDatasource(String dbName) {
        log.trace("Try get datasource for DB: {}", dbName);
        log.debug("Url for gisDb: {}", crgProperties.getGisDbUrl());

        HikariDataSource newDataSource = new HikariDataSource();
        newDataSource.setJdbcUrl(crgProperties.getGisDbUrl() + dbName);
        newDataSource.setUsername(crgProperties.getGisDbUser());
        newDataSource.setPassword(crgProperties.getGisDbPassword());
        newDataSource.setMaximumPoolSize(1);

        return newDataSource;
    }
}
