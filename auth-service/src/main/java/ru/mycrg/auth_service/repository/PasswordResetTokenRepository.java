package ru.mycrg.auth_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.mycrg.auth_service.entity.PasswordResetToken;
import ru.mycrg.auth_service.entity.User;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends CrudRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void removeByUser(User user);

    @Modifying
    @Query(value = "DELETE FROM PasswordResetToken WHERE createdAt < :dateTime")
    void deleteExpiredTokens(@Param("dateTime") LocalDateTime dateTime);

    @Query(value = "SELECT * FROM password_reset_tokens AS tokens " +
            "WHERE tokens.user_id = :userId " +
            "ORDER BY tokens.created_at DESC LIMIT 1", nativeQuery = true)
    Optional<PasswordResetToken> findByUserLatest(@Param("userId") Long userId);
}
