package ru.mycrg.gateway.domain;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.oauth_client.JwtToken;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Optional;

import static java.lang.Integer.MAX_VALUE;

@Service
public class CookieHandler implements TokenHandler {

    public final int COOKIE_VERSION = 1;
    public final String COOKIE_NAME = "crgAuthCookie";
    public final String SEPARATOR = "---crg---";

    @NotNull
    public Cookie makeCookie(JwtToken tokenModel) {
        String asString = tokenModel.getAccess_token() + SEPARATOR + tokenModel.getRefresh_token();

        Cookie authCookie = new Cookie(COOKIE_NAME, asString);
        authCookie.setVersion(COOKIE_VERSION);
        authCookie.setPath("/");
        authCookie.setMaxAge(MAX_VALUE);
        authCookie.setHttpOnly(true);

        return authCookie;
    }

    public Cookie makeDeletionCookie() {
        Cookie authCookie = new Cookie(COOKIE_NAME, "");
        authCookie.setMaxAge(0);

        return authCookie;
    }

    @Override
    public Optional<JwtToken> extractToken(@NotNull HttpServletRequest request) {
        final Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) {
            return Optional.empty();
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
            return Optional.empty();
        }
    }

    public String getCookieName() {
        return COOKIE_NAME;
    }
}
