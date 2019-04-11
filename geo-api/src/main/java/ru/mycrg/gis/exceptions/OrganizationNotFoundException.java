package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.persistence.EntityNotFoundException;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class OrganizationNotFoundException extends EntityNotFoundException {
	private static final long serialVersionUID = -1152044292122335379L;

	public OrganizationNotFoundException(Long orgId) {
		super("Организация с Id: " + orgId + " не найдена");
	}

	public OrganizationNotFoundException(String userName) {
		super("Для пользователя " + userName + " организация не найдена");
	}
}
