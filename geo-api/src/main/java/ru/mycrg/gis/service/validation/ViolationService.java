package ru.mycrg.gis.service.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zaxxer.hikari.HikariDataSource;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.gis.config.CrgProperties;
import ru.mycrg.gis.dto.ProjectModel;
import ru.mycrg.gis.exceptions.CrgFailedException;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static ru.mycrg.common.enums.ProcessStatus.DONE;

@Service
public class ViolationService {

    private static Logger log = LoggerFactory.getLogger(ViolationService.class);

    private final FgistpRuleService ruleService;
    private final ProjectService projectService;
    private final CrgProperties crgProperties;

    public ViolationService(CrgProperties crgProperties, FgistpRuleService ruleService, ProjectService projectService) {
        this.crgProperties = crgProperties;
        this.ruleService = ruleService;
        this.projectService = projectService;
    }

    public List<ObjectValidationResult> getResult(Long orgId, Long projectId, Principal principal, String layerName, int nPage, int nSize) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        ruleService.checkFeatureByName(layerName);

        ProjectModel projectById = projectService.getProject(orgId, projectId, principal);

        ValidationMqResponse validationMqResponse = null;
        try {
            validationMqResponse = fetchViolations(projectById, layerName, nPage, nSize);
        } catch (Exception e) {
            log.error("Не удалось выбрать результаты валидации для: " + layerName, e);

            throw new CrgFailedException(e.getMessage());
        }

        return validationMqResponse.getResults();
    }

    /**
     * Выборка результатов валидации
     */
    private ValidationMqResponse fetchViolations(ProjectModel projectModel, String layerName, int pIndex, int pSize)
            throws IOException {
        ValidationMqResponse response = new ValidationMqResponse();
        response.setStatus(DONE);

        log.debug("Get info for: {}", projectModel.getWorkspaceName() + "." + layerName);

        JdbcTemplate jdbcTemplate = new JdbcTemplate(getDatasource(projectModel.getDatabaseName()));

        Long totalViolations = countTotalViolations(jdbcTemplate, projectModel.getWorkspaceName(), layerName);
        if (totalViolations > 0) {
            List<Map<String, Object>> violations = getViolations(jdbcTemplate, projectModel.getWorkspaceName(),
                    layerName, pSize, pIndex);

            log.info("Found {} violations", violations.size());
            response.setResults(mapToViolations(violations));
            response.setValidated(true);
        } else {
            // response.setValidated(baseDaoService.isValidated(jdbcTemplate, resource));
        }

//            LocalDateTime localDateTime = lastCalculatedValidation.get(resource.getResourceId());
//            response.setLastValidated(localDateTime != null ? localDateTime.toString() : null);
        response.setTotal(totalViolations);
        response.setStatus(DONE);

        return response;
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

    private HikariDataSource getDatasource(String dbName) {
        log.debug("Try get datasource for DB: {}", dbName);

        HikariDataSource newDataSource = new HikariDataSource();
        newDataSource.setJdbcUrl(crgProperties.getGisDbUrl() + dbName);
        newDataSource.setUsername(crgProperties.getGisDbUser());
        newDataSource.setPassword(crgProperties.getGisDbPassword());
        newDataSource.setMaximumPoolSize(1);

        return newDataSource;
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
}
