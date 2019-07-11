package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    Optional<User> findUserByUsername(String name);
    Optional<User> findUserByEmail(String email);
}
