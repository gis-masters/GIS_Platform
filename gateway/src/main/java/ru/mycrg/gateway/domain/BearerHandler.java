package ru.mycrg.gateway.domain;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.oauth_client.JwtToken;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Service
public class BearerHandler implements TokenHandler {

    @Override
    public Optional<JwtToken> extractToken(@NotNull HttpServletRequest request) {
        final String authorization = request.getHeader("Authorization");
        if (authorization == null) {
            return Optional.empty();
        }

        final String accessToken = authorization.split("Bearer ")[1];
        if (accessToken == null) {
            return Optional.empty();
        }

        JwtToken tokenModel = new JwtToken();
        tokenModel.setAccess_token(accessToken);

        return Optional.of(tokenModel);
    }
}
