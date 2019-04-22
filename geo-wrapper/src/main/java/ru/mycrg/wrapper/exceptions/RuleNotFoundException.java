package ru.mycrg.wrapper.exceptions;

public class RuleNotFoundException extends RuntimeException {
	private static final long serialVersionUID = -1252143292922345179L;

	public RuleNotFoundException(String feature) {
		super("Не найдено правило для фичи: " + feature);
	}
}
