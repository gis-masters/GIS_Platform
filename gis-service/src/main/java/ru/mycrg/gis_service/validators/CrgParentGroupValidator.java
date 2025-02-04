package ru.mycrg.gis_service.validators;

import org.springframework.beans.factory.annotation.Autowired;
import ru.mycrg.gis_service.repository.GroupRepository;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class CrgParentGroupValidator implements ConstraintValidator<CrgParentGroup, Long> {

    @Autowired
    private GroupRepository groupRepository;

    @Override
    public void initialize(CrgParentGroup constraintAnnotation) {
    }

    @Override
    public boolean isValid(Long value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        return groupRepository.findById(value).isPresent();
    }
}
