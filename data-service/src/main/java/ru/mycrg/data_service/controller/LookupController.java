package ru.mycrg.data_service.controller;

import org.springframework.web.bind.annotation.*;
import ru.mycrg.common_contracts.generated.data_service.LookupModel;
import ru.mycrg.data_service.redis.RedisService;

@RestController
@RequestMapping("/lookup")
public class LookupController {

    private final RedisService redisService;

    public LookupController(RedisService redisService) {
        this.redisService = redisService;
    }

    @PostMapping
    public void setValue(@RequestBody LookupModel payload) {
        redisService.setValue(payload.getKey(), payload.getPayload());
    }

    @GetMapping
    public Object getValue(@RequestParam String key) {
        return redisService.getValue(key);
    }
}
