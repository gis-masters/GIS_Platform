package ru.mycrg.jwt_support;

import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.Base64;
import java.util.Map;

public class JwtTokenEncoder {

    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final Map<String, Object> HEADER = Map.of("alg", "HS256", "typ", "JWT");

    private final ObjectMapper objectMapper;

    public JwtTokenEncoder() {
        this(new ObjectMapper());
    }

    public JwtTokenEncoder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String encode(Map<String, Object> claims, String secret) {
        return encode(claims, secret.getBytes(StandardCharsets.UTF_8));
    }

    public String encode(Map<String, Object> claims, byte[] secret) {
        String headerPart = encodeBase64Url(HEADER);
        String claimsPart = encodeBase64Url(claims);
        String signaturePart = encodeBase64Url(sign(headerPart + "." + claimsPart, secret));

        return headerPart + "." + claimsPart + "." + signaturePart;
    }

    private String encodeBase64Url(Object value) {
        return Base64.getUrlEncoder()
                     .withoutPadding()
                     .encodeToString(objectMapper.writeValueAsBytes(value));
    }

    private String encodeBase64Url(byte[] value) {
        return Base64.getUrlEncoder()
                     .withoutPadding()
                     .encodeToString(value);
    }

    private byte[] sign(String content, byte[] secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(secret, HMAC_SHA256));

            return mac.doFinal(content.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Unable to initialize JWT signature generator", e);
        }
    }
}
