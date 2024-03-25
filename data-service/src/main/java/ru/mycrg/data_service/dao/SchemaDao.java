package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.JsonConverter;

import static java.util.Optional.ofNullable;

@Transactional
@Repository
public class SchemaDao {
    private static final Logger log = LoggerFactory.getLogger(SchemaDao.class);

    private  final BaseDao baseDao;

    public SchemaDao(BaseDao baseDao) {
        this.baseDao = baseDao;
    }

    public SchemaTemplate find(@NotNull String schemaName) throws CrgDaoException {
        log.debug("get schema by name : " + schemaName);
        var byName = "name = '" + schemaName + "'";
        return baseDao.findBy(new ResourceQualifier("data", "schemas"), byName)
                .map(IRecord::getContent)
                .map(map -> {
                    var schema = new SchemaTemplate();
                    schema.setId(Long.parseLong(map.get("id").toString()));
                    schema.setName(map.get("name").toString());
                    schema.setClassRule(JsonConverter.toJsonNodeFromString(map.get("class_rule").toString()));
                    ofNullable(map.get("custom_rule"))
                            .map(Object::toString)
                            .ifPresent(schema::setCustomRule);
                    ofNullable(map.get("calculated_fields"))
                            .map(Object::toString)
                            .ifPresent(schema::setCustomRule);
                    return schema;
                })
                //.map(map -> JsonConverter.fromKeyValueMap(map, Schema.class))
                .orElseThrow(() -> new CrgDaoException("Schema not found"));
    }

}
