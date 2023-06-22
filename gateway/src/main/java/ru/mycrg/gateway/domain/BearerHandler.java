package ru.mycrg.gateway.domain;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.oauth_client.JwtToken;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

public class BearerHandler implements TokenHandler {

    private TokenHandler tokenHandler;

    public BearerHandler() {
        // Required
    }

    public BearerHandler(TokenHandler tokenHandler) {
        this.tokenHandler = tokenHandler;
    }

    @Override
    public Optional<JwtToken> extract(@NotNull HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization == null) {
            if (tokenHandler != null) {
                return tokenHandler.extract(request);
            } else {
                return Optional.empty();
            }
        }

        String[] splited = authorization.split("Bearer ");
        if (splited.length <= 1) {
            return Optional.empty();
        }

        String accessToken = splited[1];
        if (accessToken == null) {
            if (tokenHandler != null) {
                return tokenHandler.extract(request);
            } else {
                return Optional.empty();
            }
        }

        JwtToken tokenModel = new JwtToken();
        tokenModel.setAccess_token(accessToken);

        return Optional.of(tokenModel);
    }
}
