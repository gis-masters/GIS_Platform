package ru.mycrg.gateway.domain;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.oauth_client.JwtToken;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Optional;

import static ru.mycrg.gateway.domain.CookieProducer.COOKIE_NAME;
import static ru.mycrg.gateway.domain.CookieProducer.SEPARATOR;

public class CookieHandler implements TokenHandler {

    private TokenHandler tokenHandler;

    public CookieHandler() {
        // Required
    }

    public CookieHandler(TokenHandler tokenHandler) {
        this.tokenHandler = tokenHandler;
    }

    @Override
    public Optional<JwtToken> extract(@NotNull HttpServletRequest request) {
        final Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) {
            if (tokenHandler != null) {
                return tokenHandler.extract(request);
            } else {
                return Optional.empty();
            }
        }

        String cookieValue = Arrays.stream(cookies)
                                   .filter(c -> c.getName().equals(COOKIE_NAME))
                                   .findFirst()
                                   .map(Cookie::getValue)
                                   .orElse(null);

        if (cookieValue != null) {
            JwtToken tokenModel = new JwtToken();

            tokenModel.setAccess_token(cookieValue.split(SEPARATOR)[0]);
            tokenModel.setRefresh_token(cookieValue.split(SEPARATOR)[1]);

            return Optional.of(tokenModel);
        } else {
            if (tokenHandler != null) {
                return tokenHandler.extract(request);
            } else {
                return Optional.empty();
            }
        }
    }
}
