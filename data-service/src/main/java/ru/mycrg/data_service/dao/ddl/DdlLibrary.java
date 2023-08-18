package ru.mycrg.data_service.dao.ddl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.wellknown_formula_generator.IWellKnownFormulaGenerator;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

import static ru.mycrg.data_service.dao.config.DaoProperties.ID;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.generatePropertySqlString;

@Service
public class DdlLibrary extends DdlBase {

    private final Logger log = LoggerFactory.getLogger(DdlLibrary.class);

    public DdlLibrary(JdbcTemplate jdbcTemplate,
                      SchemasAndTablesRepository schemasAndTablesRepository,
                      List<IWellKnownFormulaGenerator> generators) {
        super(jdbcTemplate, schemasAndTablesRepository, generators);
    }

    public void create(String targetTable, List<SimplePropertyDto> schemaProperties) {
        String target = "data." + targetTable;

        StringBuilder propertiesBuilder = new StringBuilder();

        for (SimplePropertyDto property: schemaProperties) {
            if (!property.getName().equalsIgnoreCase(ID)) {
                String formulaName = property.getCalculatedValueWellKnownFormula();

                String generateProperties = generatePropertySqlString(property);
                String result = wellKnownFormulaGenerate(formulaName, generateProperties);

                propertiesBuilder.append(",").append(result);
            }
        }
        propertiesBuilder.append(", versions jsonb");
        propertiesBuilder.append(", is_deleted boolean DEFAULT false");

        String query = String.format(
                "CREATE TABLE %1$s (%2$s serial NOT NULL %3$s ); ALTER TABLE ONLY %1$s ADD " +
                        "CONSTRAINT %4$s_pkey PRIMARY KEY (%2$s);",
                target, ID, propertiesBuilder, targetTable);

        log.debug("Create table query: [{}]", query);

        jdbcTemplate.execute(query);
    }
}
