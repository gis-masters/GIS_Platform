package ru.mycrg.auth_service_contract.dto.esia;

public class EsiaJWT {

    private String access_token;
    private String id_token;
    private String state;
    private String token_type;
    private Long expires_in;

    public EsiaJWT() {
        // Required
    }

    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public String getId_token() {
        return id_token;
    }

    public void setId_token(String id_token) {
        this.id_token = id_token;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getToken_type() {
        return token_type;
    }

    public void setToken_type(String token_type) {
        this.token_type = token_type;
    }

    public Long getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(Long expires_in) {
        this.expires_in = expires_in;
    }

    @Override
    public String toString() {
        return "{" +
                "\"access_token\":" + (access_token == null ? "null" : "\"" + access_token + "\"") + ", " +
                "\"id_token\":" + (id_token == null ? "null" : "\"" + id_token + "\"") + ", " +
                "\"state\":" + (state == null ? "null" : "\"" + state + "\"") + ", " +
                "\"token_type\":" + (token_type == null ? "null" : "\"" + token_type + "\"") + ", " +
                "\"expires_in\":" + (expires_in == null ? "null" : "\"" + expires_in + "\"") +
                "}";
    }
}
