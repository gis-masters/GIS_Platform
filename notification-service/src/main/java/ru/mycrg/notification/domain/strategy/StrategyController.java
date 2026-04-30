package ru.mycrg.notification.domain.strategy;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/strategies")
public class StrategyController {

    private final StrategyService strategyService;

    public StrategyController(StrategyService strategyService) {
        this.strategyService = strategyService;
    }

    @GetMapping
    public ResponseEntity<List<StrategyDto>> getAllStrategies() {
        return ResponseEntity.ok(strategyService.getAllStrategies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StrategyDto> getStrategyById(@PathVariable Long id) {
        return ResponseEntity.ok(strategyService.getStrategyById(id));
    }

    @GetMapping("/by-name/{name}")
    public ResponseEntity<StrategyDto> getStrategyByName(@PathVariable String name) {
        return ResponseEntity.ok(strategyService.getStrategyByName(name));
    }

    @PostMapping
    public ResponseEntity<StrategyDto> createStrategy(@Valid @RequestBody StrategyDto strategyDto) {
        return new ResponseEntity<>(strategyService.createStrategy(strategyDto), CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StrategyDto> updateStrategy(@PathVariable Long id,
                                                      @Valid @RequestBody StrategyDto strategyDto) {
        return ResponseEntity.ok(strategyService.updateStrategy(id, strategyDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStrategy(@PathVariable Long id) {
        strategyService.deleteStrategy(id);
        return ResponseEntity.noContent().build();
    }
}
