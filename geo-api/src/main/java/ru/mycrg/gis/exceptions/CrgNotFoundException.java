package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.persistence.EntityNotFoundException;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class CrgNotFoundException extends EntityNotFoundException {
	private static final long serialVersionUID = -1152044292992335379L;

	public CrgNotFoundException(String msg) {
		super(msg);
	}
}
