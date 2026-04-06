package ru.mycrg.auth_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.entity.User;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "users",
                        path = "users",
                        excerptProjection = UserProjection.class)
public interface UserRepository extends JpaRepository<User, Long> {

    @Modifying
    @Query("UPDATE User u SET u.enabled = true, u.lastModified = CURRENT_TIMESTAMP WHERE u.login = :login")
    @RestResource(exported = false)
    void activateUserByLogin(@Param("login") String login);

    @RestResource(exported = false)
    void deleteByLogin(@Param("login") String login);

    @RestResource(exported = false)
    Optional<User> findByLoginIgnoreCase(@Param("login") String login);

    @RestResource(exported = false)
    Optional<User> findByEmailIgnoreCase(@Param("email") String email);

    @RestResource(exported = false)
    List<User> findByBossId(Integer bossId);
}
