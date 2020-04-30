package ru.mycrg.data_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.mycrg.data_service.validators.ValidateEnum;

import javax.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermissionCreateDto {

    @Min(message = "Минимальное допустимое значение 1", value = 1)
    @Max(Long.MAX_VALUE)
    @NotNull
    private Long principalId;

    @NotBlank
    @Pattern(regexp = "^(user|group)$", message = "Допустимые значения поля principalType: user или group")
    private String principalType;

    @NotBlank
    @ValidateEnum(targetClassType = Roles.class, message = "Допустимые значения поля role: OWNER, CONTRIBUTOR, VIEWER")
    private String role;

}
