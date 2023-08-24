package ru.mycrg.data_service.dao.utils.query_builder.rule_handlers;

import com.healthmarketscience.sqlbuilder.Condition;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.TransformException;
import ru.mycrg.data_service.dto.styles.RuleFilter;

public interface RuleMapper {

    Condition map(RuleFilter filter) throws FactoryException, TransformException;
}
