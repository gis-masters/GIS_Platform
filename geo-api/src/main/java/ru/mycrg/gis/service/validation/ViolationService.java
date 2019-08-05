package ru.mycrg.gis.service.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zaxxer.hikari.HikariDataSource;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.ValidationInfo;
import ru.mycrg.gis.config.CrgProperties;
import ru.mycrg.gis.dto.ProjectModel;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.exceptions.CrgFailedException;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.dataSchema.DataSchemaService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static ru.mycrg.common.enums.ProcessStatus.DONE;
import static ru.mycrg.common.enums.ProcessStatus.ERROR;

@Service
public class ViolationService {

    private static Logger log = LoggerFactory.getLogger(ViolationService.class);

    private final DataSchemaService schemaService;
    private final ProjectService projectService;
    private final CrgProperties crgProperties;

    public ViolationService(CrgProperties crgProperties, DataSchemaService schemaService, ProjectService projectService) {
        this.crgProperties = crgProperties;
        this.schemaService = schemaService;
        this.projectService = projectService;
    }

    /**
     * Выборка результатов валидации
     *
     * @param orgId     Организация
     * @param projectId Проект
     * @param layerName Название слоя
     * @param pIndex    индекс страницы
     * @param pSize     размер старницы
     * @return {@link ValidationResponseDto}
     */
    public ValidationResponseDto getViolations(Long orgId, Long projectId, String layerName, int pIndex, int pSize)
            throws CrgFailedException {
        schemaService.checkFeatureByName(layerName);

        ProjectModel projectModel = projectService.getProject(orgId, projectId);

        ValidationResponseDto response = new ValidationResponseDto();
        HikariDataSource datasource = getDatasource(projectModel.getDatabaseName());
        try {
            log.debug("Get info for: {}", projectModel.getWorkspaceName() + "." + layerName);

            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasource);

            Long totalViolations = countTotalViolations(jdbcTemplate, projectModel.getWorkspaceName(), layerName);
            if (totalViolations > 0) {
                List<Map<String, Object>> violations = getViolations(jdbcTemplate, projectModel.getWorkspaceName(),
                        layerName, pSize, pIndex);

                log.info("Found {} violations", violations.size());
                response.setResults(mapToViolations(violations));
                response.setValidated(isValidated(jdbcTemplate, projectModel.getWorkspaceName(), layerName));
            }

            response.setTotal(totalViolations);
            response.setStatus(DONE);
        } catch (Exception e) {
            log.error("Не удалось выбрать результаты валидации для: " + layerName, e);
            response.setStatus(ERROR);
            response.setError(e.getMessage());

            datasource.close();
            throw new CrgFailedException(e.getMessage());
        }

        datasource.close();
        return response;
    }

    /**
     * Выборка общей инфы по провалидированным слоям
     * @param orgId     Организация
     * @param projectId Проект
     * @param request Список слоев {@link ValidationRequestDto}
     * @return list of {@link ValidationInfo}
     */
    public List<ValidationInfo> getShortInfo(Long orgId, Long projectId, ValidationRequestDto request) {
        List<ValidationInfo> result = new ArrayList<>();

        ProjectModel projectModel = projectService.getProject(orgId, projectId);

        HikariDataSource datasource = getDatasource(projectModel.getDatabaseName());
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasource);
        request.getLayers().forEach(layerName -> {
            ValidationInfo validationInfo = new ValidationInfo();
            try {
                Long totalViolations = countTotalViolations(jdbcTemplate, projectModel.getWorkspaceName(), layerName);

                if (totalViolations > 0) {
                    validationInfo.setValidated(true);
                } else {
                    validationInfo.setValidated(isValidated(jdbcTemplate, projectModel.getWorkspaceName(), layerName));
                }

                validationInfo.setTotalViolations(totalViolations);
                validationInfo.setFeatureName(layerName);
                validationInfo.setStatus(DONE);

                result.add(validationInfo);
            } catch (Exception e) {
                validationInfo.setStatus(ERROR);
                result.add(validationInfo);

                log.warn("Ошибка выборки со слоя: {}", layerName);
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

            ObjectMapper mapper = new ObjectMapper();
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
        log.debug("Try get datasource for DB: {}", dbName);
        log.debug("Url for gisDb: {}", crgProperties.getGisDbUrl());

        HikariDataSource newDataSource = new HikariDataSource();
        newDataSource.setJdbcUrl(crgProperties.getGisDbUrl() + dbName);
        newDataSource.setUsername(crgProperties.getGisDbUser());
        newDataSource.setPassword(crgProperties.getGisDbPassword());
        newDataSource.setMaximumPoolSize(1);

        return newDataSource;
    }

}
