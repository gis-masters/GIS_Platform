package ru.mycrg.gis.service.fgistp.rules;

import ru.mycrg.common.EntityType;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class FgistpRules {

    private List<EntityType> entityTypes = new ArrayList<>();

    public FgistpRules() {}

    public FgistpRules(List<EntityType> entityTypes) {
        this.entityTypes = entityTypes;
    }

    public void addComplexType(EntityType entityType) {
        entityTypes.add(entityType);
    }

    public List<EntityType> getEntityTypes() {
        return entityTypes;
    }

    public void setEntityTypes(List<EntityType> entityTypes) {
        this.entityTypes = entityTypes;
    }

    public Optional<EntityType> getClassTypeByName(String name) {
        return entityTypes.stream()
                .filter(fgistpClassType -> fgistpClassType.getName().equals(name))
                .findFirst();
    }
}
