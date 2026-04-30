package ru.mycrg.cryptopro.service;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class VerifyResponse {

    private String message;
    private String signer;
    private String code;
    private boolean verified;

    public VerifyResponse() {
        this.verified = false;
    }

    public VerifyResponse(String message, String signer, String code, boolean verified) {
        this.message = message;
        this.signer = signer;
        this.code = code;
        this.verified = verified;
    }

    public static VerifyResponse verificationFailed(String message) {
        return new VerifyResponse(message, null, null, false);
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSigner() {
        return signer;
    }

    public void setSigner(String signer) {
        this.signer = signer;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}
