package ru.mycrg.gis_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.validation.ConstraintViolation;
import java.util.Set;
import java.util.stream.Collectors;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class CrgValidationException extends javax.validation.ValidationException {

    public <T> CrgValidationException(Set<ConstraintViolation<T>> violations) {
        super(violations != null ? toString(violations) : "");
    }

	private static String toString(Set<? extends ConstraintViolation<?>> constraintViolations) {
		return constraintViolations.stream()
				.map( cv -> cv == null ? "null" : cv.getPropertyPath() + ": " + cv.getMessage() )
				.collect( Collectors.joining( ", " ) );
	}

}
