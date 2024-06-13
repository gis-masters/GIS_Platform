package ru.mycrg.auth_service.service.specialization;

import org.jetbrains.annotations.Nullable;
import ru.mycrg.common_contracts.specialization.Specialization;
import ru.mycrg.common_contracts.generated.specialization.SpecializationView;

public class SpecializationMapper {

    public static SpecializationView mapToCompact(@Nullable Specialization spec) {
        return spec == null
                ? new SpecializationView()
                : new SpecializationView(spec.getId(),
                                         spec.getTitle(),
                                         spec.getDescription(),
                                         spec.getTags());
    }
}
