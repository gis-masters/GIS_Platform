package ru.crg.gisogd_service.route;

import org.apache.camel.builder.RouteBuilder;

/**
 * Route templates using {@link RouteBuilder} which allows
 * us to define a number of templates (parameterized routes)
 * which we can create routes from.
 * @author Sergey Valiev
 */
//TODO: temporary unused
//@Component
public class RouteTemplates extends RouteBuilder {

    @Override
    public void configure() {
        routeTemplate("generalRouteTemplate")
                .templateParameter("test")
                .from("timer:{{test}}?period=1s")
                .setBody(simple("test message"))
                .log("Java says ${body}");
        ;
    }
}
