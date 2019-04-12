package ru.mycrg.wrapper.service;

import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ru.mycrg.wrapper.dao.GisStorage;

@Component
public class InitApplication {

    private final GisStorage gisStorage;

    public InitApplication(GisStorage gisStorage) {
        this.gisStorage = gisStorage;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void contextRefreshedEvent() {
        // Разворачиваем шаблон базы по 10 приказу в бд: gis (эта бд есть в развернутом GIS контейнере kartoza/postgis)
        gisStorage.initP10Template("gis", "fiz");
    }
}
