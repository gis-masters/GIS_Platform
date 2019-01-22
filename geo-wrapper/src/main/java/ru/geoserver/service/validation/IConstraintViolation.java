package ru.geoserver.service.validation;

/**
 * Describes a constraint violation. This object exposes the constraint
 * violation context as well as the message describing the violation.
 */
public interface IConstraintViolation {

	/**
	 * @return the field name
	 */
	String getName();

	/**
	 * Returns the value failing to pass the constraint.
	 * For cross-parameter constraints, an {@code Object[]} representing
	 * the method invocation arguments is returned.
	 *
	 * @return the value failing to pass the constraint
	 */
	Object getValue();

	void addViolation(String msg);
}
