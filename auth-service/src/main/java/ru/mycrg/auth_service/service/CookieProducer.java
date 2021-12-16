package ru.mycrg.auth_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.oauth_client.JwtToken;

import javax.servlet.http.Cookie;

import static java.lang.Integer.MAX_VALUE;

@Service
public class CookieProducer {

    public static final int COOKIE_VERSION = 1;
    public static final String COOKIE_NAME = "crgAuthCookie";
    public static final String SEPARATOR = "---crg---";

    @NotNull
    public Cookie makeFromJwtToken(@NotNull JwtToken tokenModel) {
        String cookieValue = tokenModel.getAccess_token() + SEPARATOR + tokenModel.getRefresh_token();

        return makeCookie(cookieValue, MAX_VALUE);
    }

    public Cookie makeDeletionCookie() {
        return makeCookie("", 0);
    }

    public String getCookieName() {
        return COOKIE_NAME;
    }

    @NotNull
    private Cookie makeCookie(String value, int age) {
        Cookie authCookie = new Cookie(COOKIE_NAME, value);
        authCookie.setVersion(COOKIE_VERSION);
        authCookie.setPath("/");
        authCookie.setMaxAge(age);
        authCookie.setHttpOnly(true);

        return authCookie;
    }
}
