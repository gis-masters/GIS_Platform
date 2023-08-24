package ru.mycrg.data_service.dao.ddl;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.utils.wellknown_formula_generator.IWellKnownFormulaGenerator;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toMap;

@Repository
public class DdlBase {

    private final Logger log = LoggerFactory.getLogger(DdlBase.class);

    protected final JdbcTemplate jdbcTemplate;
    protected final SchemasAndTablesRepository schemasAndTablesRepository;
    protected final Map<String, IWellKnownFormulaGenerator> wellKnownFormulaGenerators;

    public DdlBase(JdbcTemplate jdbcTemplate,
                   SchemasAndTablesRepository schemasAndTablesRepository,
                   List<IWellKnownFormulaGenerator> generators) {
        this.jdbcTemplate = jdbcTemplate;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.wellKnownFormulaGenerators = generators.stream()
                                                    .collect(toMap(IWellKnownFormulaGenerator::getType,
                                                                   Function.identity()));
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
    protected String wellKnownFormulaGenerate(@Nullable String formulaName, String result) {
        if (formulaName == null) {
            log.warn("valueWellKnownFormula is null. Check schema!!!");

            return result;
        }

        IWellKnownFormulaGenerator formulaGenerator = wellKnownFormulaGenerators.get(formulaName);
        if (nonNull(formulaGenerator)) {
            result += formulaGenerator.generate();
        } else {
            log.warn("No exist generator for valueWellKnownFormula: {}", formulaName);
        }

        return result;
    }
}
