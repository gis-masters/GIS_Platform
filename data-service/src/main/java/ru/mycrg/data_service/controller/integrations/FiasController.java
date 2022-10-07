package ru.mycrg.data_service.controller.integrations;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.FullAddressDto;
import ru.mycrg.data_service.dto.LocalityDto;
import ru.mycrg.data_service.service.FiasService;

import java.util.List;
import java.util.Objects;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/integration/fias")
public class FiasController {

    private final FiasService fiasService;

    public FiasController(FiasService fiasService) {
        this.fiasService = fiasService;
    }

    @PostMapping("/import")
    public ResponseEntity<Object> save(@RequestParam String path) {
        fiasService.truncateFiasData();
        fiasService.loadFiasDataToDB(path);
        fiasService.generateFullAddressesAndSave();
        fiasService.generateLocalityData();

        return ResponseEntity.status(OK).build();
    }

    @GetMapping("/fulladdress")
    public ResponseEntity<List<FullAddressDto>> getAppropriateAddress(@RequestParam String address) {
        if (Objects.isNull(address) || address.isEmpty()) {
            return ResponseEntity.status(OK).build();
        }
        List<FullAddressDto> addresses = fiasService.getAddresses(address);

        return ResponseEntity.status(OK).body(addresses);
    }

    @GetMapping("/fulladdress/v1")
    public ResponseEntity<List<FullAddressDto>> getFullAppropriateAddress(@RequestParam String address) {
        if (Objects.isNull(address) || address.isEmpty()) {
            return ResponseEntity.status(OK).build();
        }
        List<FullAddressDto> addresses = fiasService.getAddressesByCompleteMatch(address);

        return ResponseEntity.status(OK).body(addresses);
    }

    @GetMapping("/oktmo")
    public ResponseEntity<List<LocalityDto>> getOktmoByCityName(@RequestParam String cityName) {
        if (Objects.isNull(cityName) || cityName.isEmpty()) {
            return ResponseEntity.status(OK).build();
        }
        List<LocalityDto> addresses = fiasService.getLocalities(cityName);

        return ResponseEntity.status(OK).body(addresses);
    }
}
