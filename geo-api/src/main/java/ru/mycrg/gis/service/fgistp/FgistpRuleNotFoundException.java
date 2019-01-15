package ru.mycrg.gis.service.fgistp;

public class FgistpRuleNotFoundException extends RuntimeException {
	private static final long serialVersionUID = -1801544292187316479L;

	public FgistpRuleNotFoundException(String name) {
		super("Не найдено правило для класса: " + name);
	}
}
