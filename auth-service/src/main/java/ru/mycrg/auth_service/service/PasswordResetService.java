package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.entity.PasswordResetToken;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.exceptions.TooManyRequestException;
import ru.mycrg.auth_service.repository.PasswordResetTokenRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.dto.InitPasswordResetDto;
import ru.mycrg.auth_service_contract.dto.PasswordResetDto;

import java.util.Optional;
import java.util.UUID;

import static java.lang.String.format;
import static java.time.LocalDateTime.now;

@Service
@Transactional
public class PasswordResetService {

    public final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final EmailService emailService;

    private final int tokenExpirationTime;
    private final int requestRate;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository,
                                UserRepository userRepository,
                                BCryptPasswordEncoder encoder,
                                EmailService emailService,
                                Environment environment) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.emailService = emailService;

        this.tokenExpirationTime = environment.getRequiredProperty("crg-options.reset-password-expiration-time",
                                                                   Integer.class);
        this.requestRate = environment.getRequiredProperty("crg-options.reset-password-request-rate", Integer.class);
    }

    public void init(InitPasswordResetDto dto) {
        userRepository.findByEmailIgnoreCase(dto.getEmail())
                      .ifPresentOrElse(
                              user -> {
                                  throwIfTokenRequestToOften(user.getId());

                                  PasswordResetToken resetToken = new PasswordResetToken(user, generateToken());
                                  tokenRepository.save(resetToken);

                                  // Clear expired tokens
                                  tokenRepository.deleteExpiredTokens(now().minusMinutes(tokenExpirationTime));

                                  // Send email
                                  emailService.sendEmailResetPassword(user, resetToken.getToken(), dto.getOrigin());
                              },
                              () -> {
                                  log.debug("Пользователь: '{}' не найден 👀. Восстанавливать нечего 📧",
                                            dto.getEmail());
                              });
    }

    public String activateToken(PasswordResetDto dto) {
        Optional<PasswordResetToken> oResetToken = tokenRepository.findByToken(dto.getToken());
        if (oResetToken.isEmpty()) {
            throw new BadRequestException("Token invalid or expired");
        }

        PasswordResetToken token = oResetToken.get();

        throwIfTokenExpired(token);

        User user = token.getUser();
        user.setPassword(encoder.encode(dto.getPassword()));

        tokenRepository.removeByUser(user);

        return user.getLogin();
    }

    public boolean isExist(String token) {
        // Clear expired tokens
        tokenRepository.deleteExpiredTokens(now().minusMinutes(tokenExpirationTime));

        return tokenRepository.findByToken(token).isPresent();
    }

    private void throwIfTokenExpired(PasswordResetToken token) {
        if (token.getCreatedAt().plusMinutes(tokenExpirationTime).isBefore(now())) {
            tokenRepository.removeByUser(token.getUser());

            throw new BadRequestException("Токен не корректен или его срок действия истёк");
        }
    }

    private void throwIfTokenRequestToOften(Long userId) {
        tokenRepository.findByUserLatest(userId)
                       .ifPresent(user -> {
                           if (user.getCreatedAt().plusSeconds(requestRate).isAfter(now())) {
                               throw new TooManyRequestException(
                                       format("Вы совершили более 1 попытки за %s секунд", requestRate));
                           }
                       });
    }

    private String generateToken() {
        return UUID.randomUUID().toString().replace("-", "") +
                UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}
