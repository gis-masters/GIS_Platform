package ru.mycrg.data_service.service.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.data_service.service.schemas.ISchemable;
import ru.mycrg.data_service_contract.dto.FollowUpAction;
import ru.mycrg.geo_json.Feature;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getFollowUpActionsByContentType;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CONTENT_TYPE_ID;

@Aspect
@Component
public class FollowUpActionsAspect {

    private final Logger log = LoggerFactory.getLogger(FollowUpActionsAspect.class);

    private final CrgScriptEngine crgScriptEngine;
    private final FollowUpDataSupplier followUpDataSupplier;
    private final Map<String, IFollowUpActionHandler> followUpActionHandlers;

    public FollowUpActionsAspect(CrgScriptEngine crgScriptEngine,
                                 FollowUpDataSupplier followUpDataSupplier,
                                 List<IFollowUpActionHandler> followUpActionHandlers) {
        this.crgScriptEngine = crgScriptEngine;
        this.followUpDataSupplier = followUpDataSupplier;
        this.followUpActionHandlers = followUpActionHandlers
                .stream()
                .collect(toMap(IFollowUpActionHandler::getType, Function.identity()));
    }

    @Pointcut("execution(* ru.mycrg.data_service.service.cqrs.library_records.handlers" +
            ".CreateLibraryRecordRequestHandler.handle(..)) || execution(* ru.mycrg.data_service.service.cqrs" +
            ".library_records.handlers.UpdateLibraryRecordRequestHandler.handle(..))")
    public void documentsPointcut() {
    }

    @Pointcut("execution(* ru.mycrg.data_service.service.cqrs.table_records.handlers" +
            ".CreateTableRecordRequestHandler.handle(..)) || execution(* ru.mycrg.data_service.service.cqrs" +
            ".table_records.handlers.UpdateTableRecordRequestHandler.handle(..))")
    public void featuresPointcut() {
    }

    @Pointcut("execution(* ru.mycrg.data_service.service.cqrs.tasks.handlers" +
            ".CreateTaskRequestHandler.handle(..)) || execution(* ru.mycrg.data_service.service.cqrs" +
            ".tasks.handlers.UpdateTaskRequestHandler.handle(..))")
    public void tasksPointcut() {
    }

    @After("tasksPointcut() || featuresPointcut() || documentsPointcut()")
    void followUpAction(JoinPoint joinPoint) {
        try {
            ISchemable schemable = (ISchemable) joinPoint.getArgs()[0];
            Optional<FollowUpData> oData = followUpDataSupplier.apply(joinPoint.getArgs()[0]);
            if (oData.isEmpty()) {
                return;
            }

            FollowUpData followUpData = oData.get();
            Feature feature = followUpData.getFeature();
            Map<String, Object> featureProps = feature.getProperties();
            Object contentType = featureProps.get(CONTENT_TYPE_ID.getName());

            List<FollowUpAction> followUpActions =
                    getFollowUpActionsByContentType(schemable.getSchema(),
                                                    contentType == null ? null : contentType.toString());
            for (FollowUpAction followUpAction: followUpActions) {
                IFollowUpActionHandler actionHandler = followUpActionHandlers.get(followUpAction.getType());
                if (actionHandler == null) {
                    log.warn("Не найден обработчик для действия: {}", followUpAction.getType());
                    continue;
                }

                if (isConditionMet(followUpAction.getTriggerAsJsFunction(), featureProps)) {
                    actionHandler.doAction(followUpAction, feature, schemable.getSchema());
                } else {
                    log.info("Запуск действия не производится.\nНе выполнено условие [{}] \nДля фичи: {}",
                             followUpAction.getTriggerAsJsFunction(), featureProps);
                }
            }
        } catch (Exception e) {
            log.error("Не удалось запустить обработку действий => {}", e.getMessage(), e);
        }
    }

    private boolean isConditionMet(String condition, Map<String, Object> featureProps) {
        try {
            return (boolean) crgScriptEngine.invokeFunction(featureProps, condition);
        } catch (Exception e) {
            return false;
        }
    }
}
