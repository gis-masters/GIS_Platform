package ru.mycrg.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupCreateDto {

    @NotBlank(message = "Please provide user name")
    @Size(min=3, max=255, message = "No less 3 and no more than 255 characters")
    private String name;

    @Size(min=3, max=255, message = "No less 3 and no more than 255 characters")
    private String description;

}
