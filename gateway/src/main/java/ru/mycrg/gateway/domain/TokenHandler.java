package ru.mycrg.gateway.domain;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.oauth_client.JwtToken;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

public interface TokenHandler {

    Optional<JwtToken> extract(@NotNull HttpServletRequest request);
}
