package ru.mycrg.jwt_support;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

import static ru.mycrg.jwt_support.JwtClaimNames.EXPIRATION;

public class JwtClaimsDecoder {

    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {
    };
    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final String HS256 = "HS256";

    private final ObjectMapper objectMapper;

    public JwtClaimsDecoder() {
        this(new ObjectMapper());
    }

    public JwtClaimsDecoder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> decodeClaims(String tokenValue, String secret) {
        return decodeClaims(tokenValue, secret.getBytes(StandardCharsets.UTF_8));
    }

    public Map<String, Object> decodeClaims(String tokenValue, byte[] secret) {
        String[] tokenParts = splitToken(tokenValue);

        Map<String, Object> header = parseJsonPart(tokenParts[0]);
        if (!HS256.equals(String.valueOf(header.get("alg")))) {
            throw new IllegalArgumentException("Unsupported JWT algorithm");
        }

        validateSignature(tokenParts, secret);

        Map<String, Object> claims = parseJsonPart(tokenParts[1]);
        validateExpiration(claims.get(EXPIRATION));

        return claims;
    }

    private String[] splitToken(String tokenValue) {
        String[] tokenParts = tokenValue.split("\\.");
        if (tokenParts.length != 3) {
            throw new IllegalArgumentException("Malformed JWT");
        }

        return tokenParts;
    }

    private void validateSignature(String[] tokenParts, byte[] secret) {
        byte[] actualSignature = decodeBase64Url(tokenParts[2]);
        byte[] expectedSignature = sign(tokenParts[0] + "." + tokenParts[1], secret);

        if (!MessageDigest.isEqual(expectedSignature, actualSignature)) {
            throw new IllegalArgumentException("Invalid JWT signature");
        }
    }

    private byte[] sign(String content, byte[] secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(secret, HMAC_SHA256));

            return mac.doFinal(content.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Unable to initialize JWT signature verifier", e);
        }
    }

    private Map<String, Object> parseJsonPart(String tokenPart) {
        return objectMapper.readValue(decodeBase64Url(tokenPart), MAP_TYPE);
    }

    private byte[] decodeBase64Url(String tokenPart) {
        try {
            return Base64.getUrlDecoder().decode(tokenPart);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Malformed JWT", e);
        }
    }

    private void validateExpiration(Object expirationValue) {
        if (expirationValue == null) {
            return;
        }

        long expirationEpochSeconds = toLong(expirationValue);
        if (Instant.now().getEpochSecond() >= expirationEpochSeconds) {
            throw new JwtExpiredException("JWT token expired");
        }
    }

    private long toLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.parseLong(String.valueOf(value));
    }
}
