package ru.mycrg.wrapper.exceptions;

public class RuleNotFoundException extends RuntimeException {

	public RuleNotFoundException(String feature) {
		super("Не найдено правило для фичи: " + feature);
	}
}
