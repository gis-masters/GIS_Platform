package ru.mycrg.data_service.kpt_import.reader;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import java.util.Optional;

public class AddressExtractor {

    @NotNull
    public static Optional<String> getAddress(AddressMain mainAddress) {
        if (mainAddress == null) {
            return Optional.empty();
        }

        String readableAddress = mainAddress.getReadableAddress();
        if (readableAddress != null) {
            return Optional.of(readableAddress);
        }

        Address addressFias = mainAddress.getAddressFias();
        if (addressFias == null) {
            return Optional.empty();
        }

        String result = "";

        AddressCity settlement = addressFias.getLevelSettlement();
        if (settlement != null) {
            Dict region = settlement.getRegion();
            if (region != null && region.getValue() != null) {
                result = result + region.getValue() + ", ";
            }

            City city = settlement.getCity();
            if (city != null && city.getNameCity() != null) {
                result = result + city.getNameCity() + ", ";
            }

            UrbanDistrict district = settlement.getUrbanDistrict();
            if (district != null) {
                result = combineTypeWithName(result, district.getTypeUrbanDistrict(), district.getNameUrbanDistrict());
            }
        }

        DetailedLevel detailedLevel = addressFias.getDetailedLevel();
        if (detailedLevel != null) {
            Street street = detailedLevel.getStreet();
            if (street != null) {
                result = combineTypeWithName(result, street.getTypeStreet(), street.getNameStreet());
            }

            Apartment apartment = detailedLevel.getApartment();
            if (apartment != null) {
                result = combineTypeWithName(result, apartment.getTypeApartment(), apartment.getNameApartment());
            }

            Level1 level1 = detailedLevel.getLevel1();
            if (level1 != null) {
                result = combineTypeWithName(result, level1.getTypeLevel1(), level1.getNameLevel1());
            }

            Level2 level2 = detailedLevel.getLevel2();
            if (level2 != null) {
                result = combineTypeWithName(result, level2.getTypeLevel2(), level2.getNameLevel2());
            }

            Level3 level3 = detailedLevel.getLevel3();
            if (level3 != null) {
                result = combineTypeWithName(result, level3.getTypeLevel3(), level3.getNameLevel3());
            }
        }

        return result.isEmpty()
                ? Optional.empty()
                : Optional.of(result.trim().replaceAll(",$", ""));
    }

    private static String combineTypeWithName(String result, String type, String name) {
        if (type != null) {
            result = result + type;
            if (name != null) {
                result = result + " " + name + ", ";
            }
        } else {
            if (name != null) {
                result = result + name + ", ";
            }
        }
        
        return result;
    }
}
