package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

    private final List<ErrorInfo> errors = new ArrayList<>();

    public BadRequestException(String msg) {
        super(msg);
    }

    public BadRequestException(String msg, ErrorInfo errorInfo) {
        super(msg);

        errors.add(errorInfo);
    }

    public BadRequestException(String msg, List<ErrorInfo> errorInfoList) {
        super(msg);

        errors.addAll(errorInfoList);
    }

    public BadRequestException(String msg, Map<String, String> errors) {
        super(msg);

        this.errors.addAll(errors.entrySet().stream()
                                 .map(entry -> new ErrorInfo(entry.getKey(),
                                                             entry.getValue()))
                                 .collect(Collectors.toList()));
    }

    public List<ErrorInfo> getErrors() {
        return errors;
    }
}
