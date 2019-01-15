package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.mycrg.gis.entity.User;

import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    Optional<User> findUserByUsername(String name);
}
