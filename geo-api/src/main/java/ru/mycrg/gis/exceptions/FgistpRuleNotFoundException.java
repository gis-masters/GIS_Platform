package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class FgistpRuleNotFoundException extends RuntimeException {
	private static final long serialVersionUID = -1801544292187316479L;

	public FgistpRuleNotFoundException(String name) {
		super("Не найдено правило для класса: " + name);
	}
}
