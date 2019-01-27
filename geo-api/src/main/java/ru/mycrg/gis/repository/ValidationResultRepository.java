package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.mycrg.gis.entity.User;
import ru.mycrg.gis.entity.ValidationResult;

import java.util.Optional;

public interface ValidationResultRepository extends PagingAndSortingRepository<ValidationResult, Long> {

    Optional<ValidationResult> findAllByUser(User user);

    Optional<ValidationResult> findAllByObjectId(String objectId);
}
