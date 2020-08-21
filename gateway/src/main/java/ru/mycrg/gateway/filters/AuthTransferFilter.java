package ru.mycrg.gateway.filters;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.SIMPLE_HOST_ROUTING_FILTER_ORDER;

@Component
public class AuthTransferFilter extends ZuulFilter implements CrgFilter {

    @Override
    public String filterType() {
        return PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return SIMPLE_HOST_ROUTING_FILTER_ORDER - 1;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        final RequestContext context = RequestContext.getCurrentContext();

        HttpServletRequest request = context.getRequest();
        String testAttribute = (String) request.getAttribute(TEMPLATE_ATTRIBUTE);

        if (testAttribute != null) {
            context.addZuulRequestHeader("Authorization", "Bearer " + testAttribute);
        }

        return null;
    }
}
