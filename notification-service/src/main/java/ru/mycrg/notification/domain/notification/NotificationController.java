package ru.mycrg.notification.domain.notification;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.notification.domain.notification.dto.NotificationRequestDto;
import ru.mycrg.notification.domain.notification.dto.NotificationResponseDto;
import ru.mycrg.notification.domain.notification.models.NotificationStatus;
import ru.mycrg.notification.notificators.GlobalNotificator;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final GlobalNotificator globalNotificator;
    private final NotificationService notificationService;

    public NotificationController(GlobalNotificator globalNotificator,
                                  NotificationService notificationService) {
        this.globalNotificator = globalNotificator;
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponseDto> create(@Valid @RequestBody NotificationRequestDto requestDto) {
        NotificationResponseDto notification = notificationService.createNotification(requestDto);

        globalNotificator.sendNotification(notification.getId());

        return new ResponseEntity<>(notification, CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @GetMapping
    public ResponseEntity<Page<NotificationResponseDto>> getAllNotifications(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(notificationService.getAllNotifications(pageable));
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<Page<NotificationResponseDto>> getNotificationsByStatus(
            @PathVariable NotificationStatus status,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(notificationService.getNotificationsByStatus(status, pageable));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<NotificationResponseDto> cancelNotification(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.cancelNotification(id));
    }
}
