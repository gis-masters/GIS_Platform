package ru.mycrg.gateway.filters;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_DECORATION_FILTER_ORDER;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

public class AuthPreFilter extends ZuulFilter {

    private static Logger log = LoggerFactory.getLogger(AuthPreFilter.class);

    @Override
    public String filterType() {
        return PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return PRE_DECORATION_FILTER_ORDER - 1;
    }

    @Override
    public boolean shouldFilter() {
        RequestContext context = RequestContext.getCurrentContext();

        return "/oauth/token".equals(context.getRequest().getServletPath());
    }

    @Override
    public Object run() {
        log.info("AuthPreFilter add Authorization");

        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.addZuulRequestHeader("Authorization", "Basic YWRtaW46Z2Vvc2VydmVy");

        return null;
    }
}
