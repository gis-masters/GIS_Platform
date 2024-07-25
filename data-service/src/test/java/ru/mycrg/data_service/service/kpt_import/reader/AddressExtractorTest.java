package ru.mycrg.data_service.service.kpt_import.reader;

import org.junit.Test;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.data_service.kpt_import.reader.AddressExtractor.getAddress;

public class AddressExtractorTest {

    @Test
    public void nullBoundaryCases() {
        assertTrue(getAddress(null).isEmpty());
        assertTrue(getAddress(new AddressMain()).isEmpty());
    }

    @Test
    public void emptyIfAllElementsAreEmpty() {
        AddressCity addressCity = new AddressCity();
        addressCity.setCity(new City());
        addressCity.setRegion(new Dict());
        addressCity.setDistrict(new District());

        DetailedLevel detailedLevel = new DetailedLevel();
        detailedLevel.setApartment(new Apartment());
        detailedLevel.setStreet(new Street());
        detailedLevel.setLevel1(new Level1());
        detailedLevel.setLevel2(new Level2());
        detailedLevel.setLevel3(new Level3());

        Address addressFias = new Address();
        addressFias.setLevelSettlement(addressCity);
        addressFias.setDetailedLevel(detailedLevel);

        AddressMain mainAddress = new AddressMain();
        mainAddress.setAddressFias(addressFias);

        assertTrue(getAddress(mainAddress).isEmpty());
    }

    @Test
    public void readableAddressHasFirstPriority() {
        String readableAddress = "Some readable address";

        AddressMain mainAddress = new AddressMain();
        mainAddress.setReadableAddress(readableAddress);

        assertTrue(getAddress(mainAddress).isPresent());
        assertEquals(readableAddress, getAddress(mainAddress).get());
    }

    @Test
    public void shouldGetAddressSeparately() {
        Dict dict = new Dict();
        dict.setValue("Севастополь");

        AddressCity addressCity = new AddressCity();
        addressCity.setRegion(dict);

        Street street = new Street();
        street.setTypeStreet("ул");
        street.setNameStreet("Ленина");

        Level1 level1 = new Level1();
        level1.setNameLevel1("первый участок");

        DetailedLevel detailedLevel = new DetailedLevel();
        detailedLevel.setStreet(street);
        detailedLevel.setLevel1(level1);

        Address addressFias = new Address();
        addressFias.setLevelSettlement(addressCity);
        addressFias.setDetailedLevel(detailedLevel);

        AddressMain mainAddress = new AddressMain();
        mainAddress.setAddressFias(addressFias);

        assertTrue(getAddress(mainAddress).isPresent());
        assertEquals("Севастополь, ул Ленина, первый участок", getAddress(mainAddress).get());
    }
}
