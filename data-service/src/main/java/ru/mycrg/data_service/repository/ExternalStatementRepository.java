package ru.mycrg.data_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.ExternalStatement;

@Repository
public interface ExternalStatementRepository extends JpaRepository<ExternalStatement, Long> {

}
