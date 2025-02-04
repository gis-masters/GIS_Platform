package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import ru.mycrg.http_client.ResponseModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class DataServiceException extends RuntimeException {

    private final List<ErrorInfo> errors = new ArrayList<>();

    public DataServiceException(String msg) {
        super(msg);
    }

    public DataServiceException(String msg, Map<String, String> details) {
        super(msg);

        for (Map.Entry<String, String> entry: details.entrySet()) {
            this.errors.add(new ErrorInfo(entry.getKey(), entry.getValue()));
        }
    }

    public DataServiceException(String msg, ErrorInfo errorInfo) {
        super(msg);

        this.errors.add(errorInfo);
    }

    public DataServiceException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public DataServiceException(String msg, ResponseModel<Object> response) {
        super(msg);

        this.errors.add(new ErrorInfo("code", String.valueOf(response.getCode())));

        if (!response.getMsg().isEmpty()) {
            this.errors.add(new ErrorInfo("msg", response.getMsg()));
        }

        Object body = response.getBody();
        if (body != null) {
            this.errors.add(new ErrorInfo("body", body.toString()));
        }
    }

    public List<ErrorInfo> getErrors() {
        return errors;
    }
}
