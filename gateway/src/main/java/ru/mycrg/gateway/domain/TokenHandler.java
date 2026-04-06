package ru.mycrg.gateway.domain;

import jakarta.servlet.http.HttpServletRequest;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.oauth_client.JwtToken;

import java.util.Optional;

public interface TokenHandler {

    Optional<JwtToken> extract(@NotNull HttpServletRequest request);
}
