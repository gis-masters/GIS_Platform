package ru.mycrg.data_service.dao.ddl;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.wellknown_formula_generator.IWellKnownFormulaGenerator;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.generatePropertySqlString;

@Repository
public class DdlTablesBase {

    private final Logger log = LoggerFactory.getLogger(DdlTablesBase.class);

    protected final JdbcTemplate jdbcTemplate;
    protected final SchemasAndTablesRepository schemasAndTablesRepository;
    protected final Map<String, IWellKnownFormulaGenerator> wellKnownFormulaGenerators;

    public DdlTablesBase(JdbcTemplate jdbcTemplate,
                         SchemasAndTablesRepository schemasAndTablesRepository,
                         List<IWellKnownFormulaGenerator> generators) {
        this.jdbcTemplate = jdbcTemplate;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.wellKnownFormulaGenerators = generators.stream()
                                                    .collect(toMap(IWellKnownFormulaGenerator::getType,
                                                                   Function.identity()));
    }

    public void create(String targetTable, List<SimplePropertyDto> schemaProperties) {
        String target = "data." + targetTable;

        StringBuilder propertiesBuilder = new StringBuilder();

        for (SimplePropertyDto property: schemaProperties) {
            String formulaName = property.getCalculatedValueWellKnownFormula();

            String generateProperties = generatePropertySqlString(property);
            String result = wellKnownFormulaGenerate(formulaName, generateProperties);

            propertiesBuilder.append(",").append(result);
        }

        String query = String.format(
                "CREATE TABLE %1$s (%2$s serial NOT NULL %3$s ); ALTER TABLE ONLY %1$s ADD " +
                        "CONSTRAINT %4$s_pkey PRIMARY KEY (%2$s);",
                target, PRIMARY_KEY, propertiesBuilder, targetTable);

        log.debug("Create table query: [{}]", query);

        jdbcTemplate.execute(query);
    }

    @Transactional
    public void drop(ResourceQualifier rQualifier) {
        log.debug("Try delete: {}", rQualifier);
        try {
            jdbcTemplate.execute(String.format("DROP TABLE IF EXISTS %1$s.%2$s",
                                               rQualifier.getSchema(), rQualifier.getTable()));
        } catch (Exception e) {
            String msg = "Ошибка при удалении таблицы " + rQualifier;

            throw new DataServiceException(msg);
        }

        schemasAndTablesRepository.deleteByIdentifier(rQualifier.getTable());
    }

    @NotNull
    protected String wellKnownFormulaGenerate(@NotNull String formulaName, String result) {
        IWellKnownFormulaGenerator formulaGenerator = wellKnownFormulaGenerators.get(formulaName);
        if (nonNull(formulaGenerator)) {
            result += formulaGenerator.generate();
        } else {
            log.warn("Unknown valueWellKnownFormula: {}", formulaName);
        }

        return result;
    }
}
