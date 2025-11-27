package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.enums.ProcessType;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "processes", path = "processes")
public interface ProcessRepository extends PagingAndSortingRepository<Process, Long> {

    @Query("SELECT p FROM Process p WHERE " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:type IS NULL OR p.type = :type) AND " +
            "(:title IS NULL OR p.title = :title) AND " +
            "p.userName = :userName")
    Page<Process> findAllByUserWithFilters(@Param("status") ProcessStatus status,
                                           @Param("type") ProcessType type,
                                           @Param("title") String title,
                                           @Param("userName") String userName,
                                           Pageable pageable);

    Page<Process> findAllByUserName(String userName, Pageable pageable);

    @Override
    @RestResource(exported = false)
    Page<Process> findAll(Pageable pageable);

    @Override
    @RestResource(exported = false)
    Iterable<Process> findAll(Sort sort);

    @Override
    @RestResource(exported = false)
    <S extends Process> S save(S s);

    @Override
    @RestResource(exported = false)
    <S extends Process> Iterable<S> saveAll(Iterable<S> iterable);

    @Override
    @RestResource(exported = false)
    Optional<Process> findById(Long aLong);

    @Override
    @RestResource(exported = false)
    boolean existsById(Long aLong);

    @Override
    @RestResource(exported = false)
    Iterable<Process> findAllById(Iterable<Long> iterable);

    @Override
    @RestResource(exported = false)
    long count();

    @Override
    @RestResource(exported = false)
    void deleteById(Long aLong);

    @Override
    @RestResource(exported = false)
    void delete(Process process);
}
