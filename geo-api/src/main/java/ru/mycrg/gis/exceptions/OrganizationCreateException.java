package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.persistence.EntityNotFoundException;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class OrganizationCreateException extends EntityNotFoundException {
	private static final long serialVersionUID = -1152044292222335339L;

	public OrganizationCreateException() {
		super("Неудалось создать организацию");
	}
}
