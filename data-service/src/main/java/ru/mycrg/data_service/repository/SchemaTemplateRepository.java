package ru.mycrg.data_service.repository;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.SchemaTemplate;

import java.util.Collection;
import java.util.List;

@Repository
public interface SchemaTemplateRepository extends PagingAndSortingRepository<SchemaTemplate, Long> {

    @Override
    @NotNull
    List<SchemaTemplate> findAll();

    List<SchemaTemplate> findByNameIn(Collection<String> names);

    List<SchemaTemplate> findByName(String name);

    @Query(value = "SELECT * FROM schemas WHERE class_rule \\:\\:text ILIKE %:property%",
           nativeQuery = true)
    List<SchemaTemplate> findBySpecificPropertyName(@Param("property") String property);

    @Query(value = "" +
            "SELECT DISTINCT json_array_elements_text(class_rule->'tags') AS tag " +
            "FROM data.schemas " +
            "WHERE EXISTS (" +
            "    SELECT 1" +
            "    FROM json_array_elements_text(class_rule->'tags') AS jt(tag)" +
            "    WHERE jt.tag = 'system'" +
            ")",
           nativeQuery = true)
    List<String> findUniqueTags();

    boolean existsByName(String name);
}
