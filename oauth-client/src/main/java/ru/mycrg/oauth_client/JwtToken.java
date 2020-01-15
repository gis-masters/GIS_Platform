package ru.mycrg.oauth_client;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JwtToken {

    private String token_type;
    private String access_token;
    private String refresh_token;
    private String scope;
    private Integer expires_in;

}
