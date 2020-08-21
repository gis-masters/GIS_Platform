package ru.mycrg.oauth_client;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JwtToken {

    private String access_token;
    private String token_type;
    private String refresh_token;
    private Integer expires_in;
    private String scope;

}
