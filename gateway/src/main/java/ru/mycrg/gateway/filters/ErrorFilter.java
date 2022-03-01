package ru.mycrg.gateway.filters;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.gateway.exceptions.CrgExceptionModel;

import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.ERROR_TYPE;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.SEND_ERROR_FILTER_ORDER;
import static org.springframework.http.HttpStatus.*;

@Component
public class ErrorFilter extends ZuulFilter {

    private final Logger log = LoggerFactory.getLogger(ErrorFilter.class);

    private static final String THROWABLE_KEY = "throwable";

    @Override
    public String filterType() {
        return ERROR_TYPE;
    }

    @Override
    public int filterOrder() {
        return SEND_ERROR_FILTER_ORDER - 1;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        RequestContext context = RequestContext.getCurrentContext();
        Object throwable = context.get(THROWABLE_KEY);

        if (throwable instanceof ZuulException) {
            ZuulException zuulException = (ZuulException) throwable;
            Throwable cause = getDeeperCause(zuulException);

            // remove error code to prevent further error handling in follow up filters
            context.remove(THROWABLE_KEY);
            context.getResponse().setContentType("application/json");

            if (cause instanceof SocketTimeoutException) {
                context.setResponseBody(new CrgExceptionModel(GATEWAY_TIMEOUT, makeReadableMsg(context, cause)).toString());
                context.setResponseStatusCode(504);
            } else if (cause instanceof UnknownHostException) {
                context.setResponseBody(new CrgExceptionModel(BAD_GATEWAY, makeReadableMsg(context, cause)).toString());
                context.setResponseStatusCode(502);
            } else {
                if (cause == null) {
                    log.debug("Something went _wrong_. Reason: {}", zuulException.getMessage(), zuulException);

                    zuulException.printStackTrace();

                    context.setResponseBody(
                            new CrgExceptionModel(INTERNAL_SERVER_ERROR, "Something went _wrong_").toString());
                    context.setResponseStatusCode(500);
                } else {
                    log.debug("Something went wrong. Reason: {}", makeReadableMsg(context, cause));

                    cause.printStackTrace();

                    context.setResponseBody(
                            new CrgExceptionModel(INTERNAL_SERVER_ERROR, "Something went wrong").toString());
                    context.setResponseStatusCode(500);
                }
            }
        }

        return null;
    }

    private String makeReadableMsg(RequestContext context, Throwable cause) {
        return "For service: " + context.getRouteHost().toString() +
                " Resource: " + context.getRequest().getRequestURI() +
                " Reason: " + cause.getMessage();
    }

    @Nullable
    private Throwable getDeeperCause(ZuulException zuulException) {
        Throwable realCause;

        realCause = zuulException.getCause();
        if (realCause != null) {
            realCause = realCause.getCause();
            if (realCause != null) {
                realCause = realCause.getCause();
            }
        }

        return realCause;
    }
}
