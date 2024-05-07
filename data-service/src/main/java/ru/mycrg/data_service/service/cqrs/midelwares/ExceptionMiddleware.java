package ru.mycrg.data_service.service.cqrs.midelwares;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.exceptions.*;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.IRequestMiddleware;
import ru.mycrg.mediator.exceptions.RequestHandlerNotFoundException;

import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Component
@Order(1)
public class ExceptionMiddleware implements IRequestMiddleware {

    @Override
    public <Response, Request extends IRequest<Response>> Response invoke(Request request, Next<Response> next) {
        try {
            return next.invoke();
        } catch (RequestHandlerNotFoundException e) {
            String msg = "Не удалось найти обработчик для команды: " + request.getType();
            logError(msg, e);

            throw new DataServiceException(msg);
        } catch (NotFoundException | ForbiddenException | ConflictException | ServiceUnavailableException |
                 DataServiceException | BadRequestException e) {
            throw e;
        } catch (Exception e) {
            String msg = "Непредвиденная ошибка в процессе обработки команды: " + request.getType();
            logError(msg, e);

            throw new DataServiceException(msg);
        }
    }
}
