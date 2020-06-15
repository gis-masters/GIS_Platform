package ru.mycrg.gis_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @Pattern(regexp = "^(VIEWER|OWNER)$", message = "Допустимые значения поля role: VIEWER, OWNER")
    private String role;

    @Override
    public String toString() {
        return "{principalId=" + principalId +
                ", principalType='" + principalType + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
