package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.persistence.EntityNotFoundException;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class UserCreationException extends EntityNotFoundException {
	private static final long serialVersionUID = -1152044292452335331L;

	public UserCreationException(String msg) {
		super(msg);
	}
}
