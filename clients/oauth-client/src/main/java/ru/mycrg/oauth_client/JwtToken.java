package ru.mycrg.oauth_client;

public class JwtToken {

    private String access_token;
    private String token_type;
    private String refresh_token;
    private Integer expires_in;
    private String scope;

    public String getAccess_token() {
        return this.access_token;
    }

    public String getToken_type() {
        return this.token_type;
    }

    public String getRefresh_token() {
        return this.refresh_token;
    }

    public Integer getExpires_in() {
        return this.expires_in;
    }

    public String getScope() {
        return this.scope;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public void setToken_type(String token_type) {
        this.token_type = token_type;
    }

    public void setRefresh_token(String refresh_token) {
        this.refresh_token = refresh_token;
    }

    public void setExpires_in(Integer expires_in) {
        this.expires_in = expires_in;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    @Override
    public String toString() {
        return "{" +
                "\"access_token\":" + (access_token == null ? "null" : "\"" + access_token + "\"") + ", " +
                "\"token_type\":" + (token_type == null ? "null" : "\"" + token_type + "\"") + ", " +
                "\"refresh_token\":" + (refresh_token == null ? "null" : "\"" + refresh_token + "\"") + ", " +
                "\"expires_in\":" + (expires_in == null ? "null" : "\"" + expires_in + "\"") + ", " +
                "\"scope\":" + (scope == null ? "null" : "\"" + scope + "\"") +
                "}";
    }
}
