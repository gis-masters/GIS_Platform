package ru.mycrg.data_service.service.smev3.model;

/**
 * При ошибке обработка входящего пакета
 */
public class ResponseFailProcess {

    private final String message;
    private final String stackTrace;
    private final String responseXmlBase64;

    public ResponseFailProcess(String message, String stackTrace, String responseXmlBase64) {
        this.message = message;
        this.stackTrace = stackTrace;
        this.responseXmlBase64 = responseXmlBase64;
    }

    public String getResponseXmlBase64() {
        return responseXmlBase64;
    }

    public String getStackTrace() {
        return stackTrace;
    }

    public String getMessage() {
        return message;
    }
}
