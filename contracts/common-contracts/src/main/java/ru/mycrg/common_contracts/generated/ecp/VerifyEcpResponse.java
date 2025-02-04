package ru.mycrg.common_contracts.generated.ecp;

public class VerifyEcpResponse {

    private String message;
    private String signer;
    private String code;
    boolean verified;

    public VerifyEcpResponse() {
        // Required
    }

    public static VerifyEcpResponse verificationFailed(String message) {
        return new VerifyEcpResponse(message, null, null, false);
    }

    public static VerifyEcpResponse verificationSuccess(String signer, String code) {
        return new VerifyEcpResponse(null, signer, code, true);
    }

    public VerifyEcpResponse(String message, String signer, String code, boolean verified) {
        this.message = message;
        this.signer = signer;
        this.code = code;
        this.verified = verified;
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

    @Override
    public String toString() {
        return "{" +
                "\"message\":" + (message == null ? "null" : "\"" + message + "\"") + ", " +
                "\"signer\":" + (signer == null ? "null" : "\"" + signer + "\"") + ", " +
                "\"code\":" + (code == null ? "null" : "\"" + code + "\"") + ", " +
                "\"verified\":\"" + verified + "\"" +
                "}";
    }
}
