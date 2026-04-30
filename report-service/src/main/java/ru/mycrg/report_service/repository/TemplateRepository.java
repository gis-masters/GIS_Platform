package ru.mycrg.report_service.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.report_service.entity.Template;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TemplateRepository extends CrudRepository<Template, Long> {

    Optional<Template> findByName(String name);

    List<Template> findByIsSystemTrue();

    int deleteByNameInAndIsSystemTrue(Set<String> names);
}
