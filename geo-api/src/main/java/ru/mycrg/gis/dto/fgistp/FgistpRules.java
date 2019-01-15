package ru.mycrg.gis.dto.fgistp;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class FgistpRules {

    private List<FgistpClassType> fgistpClassTypes = new ArrayList<>();

    public FgistpRules() {}

    public FgistpRules(List<FgistpClassType> fgistpClassTypes) {
        this.fgistpClassTypes = fgistpClassTypes;
    }

    public void addComplexType(FgistpClassType fgistpClassType) {
        fgistpClassTypes.add(fgistpClassType);
    }

    public List<FgistpClassType> getFgistpClassTypes() {
        return fgistpClassTypes;
    }

    public void setFgistpClassTypes(List<FgistpClassType> fgistpClassTypes) {
        this.fgistpClassTypes = fgistpClassTypes;
    }

    public Optional<FgistpClassType> getClassTypeByName(String name) {
        return fgistpClassTypes.stream()
                .filter(fgistpClassType -> fgistpClassType.getName().equals(name))
                .findFirst();
    }
}
