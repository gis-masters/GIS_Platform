package ru.mycrg.jwt_support;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtCodecTest {

    private static final String SECRET = "secret";

    private final JwtTokenEncoder jwtTokenEncoder = new JwtTokenEncoder();
    private final JwtClaimsDecoder jwtClaimsDecoder = new JwtClaimsDecoder();

    @Test
    void shouldEncodeAndDecodeClaims() {
        Map<String, Object> claims = Map.of(
                JwtClaimNames.SUBJECT, "user",
                JwtClaimNames.TOKEN_KIND, JwtTokenKinds.ACCESS,
                JwtClaimNames.ISSUED_AT, Instant.now().getEpochSecond(),
                JwtClaimNames.EXPIRATION, Instant.now().plusSeconds(60).getEpochSecond(),
                "user_name", "demo",
                JwtClaimNames.AUTHORITIES, List.of("ROLE_USER")
        );

        String token = jwtTokenEncoder.encode(claims, SECRET);
        Map<String, Object> decodedClaims = jwtClaimsDecoder.decodeClaims(token, SECRET);

        assertEquals("user", decodedClaims.get(JwtClaimNames.SUBJECT));
        assertEquals("demo", decodedClaims.get("user_name"));
        assertEquals(List.of("ROLE_USER"), decodedClaims.get(JwtClaimNames.AUTHORITIES));
        assertEquals(JwtTokenKinds.ACCESS, decodedClaims.get(JwtClaimNames.TOKEN_KIND));
    }

    @Test
    void shouldFailForExpiredToken() {
        Map<String, Object> claims = Map.of(
                JwtClaimNames.SUBJECT, "user",
                JwtClaimNames.EXPIRATION, Instant.now().minusSeconds(1).getEpochSecond()
        );

        String token = jwtTokenEncoder.encode(claims, SECRET);

        assertThrows(JwtExpiredException.class, () -> jwtClaimsDecoder.decodeClaims(token, SECRET));
    }
}
