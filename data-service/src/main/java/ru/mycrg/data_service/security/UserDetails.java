package ru.mycrg.data_service.security;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserDetails {
    private Long userId;
    private List<Long> groups = new ArrayList<>();

    public void addGroupId(Long id) {
        this.groups.add(id);
    }
}
