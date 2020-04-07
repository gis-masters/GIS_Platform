package ru.mycrg.auth_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.entity.User;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "users",
                        path = "users",
                        excerptProjection = UserProjection.class)
public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    @Modifying
    @Query("UPDATE User u SET u.enabled = true, u.lastModified = CURRENT_TIMESTAMP WHERE u.username = :username")
    @RestResource(exported = false)
    int activateUserByName(@Param("username") String username);

    @RestResource(exported = false)
    void deleteByUsername(@Param("username") String userName);

    @RestResource(exported = false)
    Optional<User> findByUsername(@Param("username") String userName);

    @RestResource(exported = false)
    Optional<User> findByEmail(@Param("email") String email);

}
