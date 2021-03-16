package ru.mycrg.gateway.domain;

import ru.mycrg.oauth_client.JwtToken;

public class AuthConclusion {

    private final JwtToken token;
    private final String cause;

    public AuthConclusion(JwtToken token, String cause) {
        this.token = token;
        this.cause = cause;
    }

    public JwtToken getToken() {
        return token;
    }

    public String getCause() {
        return cause;
    }
}
