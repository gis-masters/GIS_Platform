package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import ru.mycrg.data_service.entity.Process;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "processes", path = "processes")
public interface ProcessRepository extends PagingAndSortingRepository<Process, Long> {

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
