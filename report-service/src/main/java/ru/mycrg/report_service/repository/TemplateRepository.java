package ru.mycrg.report_service.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.mycrg.report_service.entity.Template;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TemplateRepository extends CrudRepository<Template, Long> {

    Optional<Template> findByName(String name);

    List<Template> findByNameIn(Set<String> names);

    List<Template> findByNameInAndIsSystemTrue(Set<String> names);

    List<Template> findByIsSystemTrue();

    @Query("""
            SELECT template
            FROM Template template
            WHERE template.organizationId IS NULL OR template.organizationId = :organizationId
            """)
    List<Template> findByOrganizationIdOrCommon(@Param("organizationId") Long organizationId);
}
