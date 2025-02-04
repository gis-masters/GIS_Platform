package ru.mycrg.gis_service.exceptions;

import org.springframework.validation.BindingResult;

public class BindingErrorsException extends RuntimeException {

    private BindingResult bindingResult;

    public BindingErrorsException(final String message, final BindingResult bindingResult) {
        super(message);

        this.bindingResult = bindingResult;
    }

    public BindingResult getBindingResult() {
        return bindingResult;
    }

}
