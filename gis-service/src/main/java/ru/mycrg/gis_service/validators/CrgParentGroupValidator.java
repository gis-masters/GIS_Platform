package ru.mycrg.gis_service.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import ru.mycrg.gis_service.repository.GroupRepository;

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
