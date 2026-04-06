package ru.mycrg.auth_facade;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class JwtAuthenticationDetails {

    private final String tokenValue;
    private final Map<String, Object> decodedDetails;

    public JwtAuthenticationDetails(String tokenValue, Map<String, Object> decodedDetails) {
        this.tokenValue = tokenValue;
        this.decodedDetails = decodedDetails == null
                ? Collections.emptyMap()
                : Collections.unmodifiableMap(new HashMap<>(decodedDetails));
    }

    public String getTokenValue() {
        return tokenValue;
    }

    public Map<String, Object> getDecodedDetails() {
        return decodedDetails;
    }
}
