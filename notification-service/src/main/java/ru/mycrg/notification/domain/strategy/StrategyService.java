package ru.mycrg.notification.domain.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.notification.exceptions.NotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StrategyService {

    private final Logger log = LoggerFactory.getLogger(StrategyService.class);

    private final StrategyRepository strategyRepository;

    public StrategyService(StrategyRepository strategyRepository) {
        this.strategyRepository = strategyRepository;
    }

    @Transactional(readOnly = true)
    public List<StrategyDto> getAllStrategies() {
        return strategyRepository.findAll().stream()
                                 .map(this::mapToDto)
                                 .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StrategyDto getStrategyById(Long id) {
        return strategyRepository
                .findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new NotFoundException("Стратегия с ID " + id + " не найдена"));
    }

    @Transactional(readOnly = true)
    public StrategyDto getStrategyByName(String name) {
        return strategyRepository
                .findByName(name)
                .map(this::mapToDto)
                .orElseThrow(() -> new NotFoundException("Стратегия с именем " + name + " не найдена"));
    }

    @Transactional
    public StrategyDto createStrategy(StrategyDto strategyDto) {
        StrategyEntity strategyEntity = mapToEntity(strategyDto);
        StrategyEntity savedStrategyEntity = strategyRepository.save(strategyEntity);
        log.info("Создана новая стратегия: {}", savedStrategyEntity.getName());

        return mapToDto(savedStrategyEntity);
    }

    @Transactional
    public StrategyDto updateStrategy(Long id, StrategyDto strategyDto) {
        StrategyEntity strategyEntity = strategyRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Стратегия с ID " + id + " не найдена"));

        strategyEntity.setName(strategyDto.getName());
        strategyEntity.setDescription(strategyDto.getDescription());
        strategyEntity.setMaxRetries(strategyDto.getMaxRetries());
        strategyEntity.setRetryIntervalSeconds(strategyDto.getRetryIntervalSeconds());
        strategyEntity.setActive(strategyDto.getActive());

        StrategyEntity updatedStrategyEntity = strategyRepository.save(strategyEntity);
        log.info("Обновлена стратегия: {}", updatedStrategyEntity.getName());

        return mapToDto(updatedStrategyEntity);
    }

    @Transactional
    public void deleteStrategy(Long id) {
        if (!strategyRepository.existsById(id)) {
            throw new NotFoundException("Стратегия с ID " + id + " не найдена");
        }

        strategyRepository.deleteById(id);

        log.info("Удалена стратегия с ID: {}", id);
    }

    private StrategyDto mapToDto(StrategyEntity strategyEntity) {
        return StrategyDto.builder()
                          .id(strategyEntity.getId())
                          .name(strategyEntity.getName())
                          .description(strategyEntity.getDescription())
                          .maxRetries(strategyEntity.getMaxRetries())
                          .retryIntervalSeconds(strategyEntity.getRetryIntervalSeconds())
                          .active(strategyEntity.getActive())
                          .build();
    }

    private StrategyEntity mapToEntity(StrategyDto strategyDto) {
        return StrategyEntity.builder()
                             .id(strategyDto.getId())
                             .name(strategyDto.getName())
                             .description(strategyDto.getDescription())
                             .maxRetries(strategyDto.getMaxRetries())
                             .retryIntervalSeconds(strategyDto.getRetryIntervalSeconds())
                             .active(strategyDto.getActive())
                             .build();
    }
}
