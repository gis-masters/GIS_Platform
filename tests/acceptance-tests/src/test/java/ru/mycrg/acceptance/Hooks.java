package ru.mycrg.acceptance;

import io.cucumber.java.After;

import java.util.ArrayList;
import java.util.HashMap;

import static ru.mycrg.acceptance.BaseStepsDefinitions.*;

public class Hooks {

    @After
    public void cleanScenarioScope() {
        System.out.println("Clean scenario scope after each scenario");

        scenarioSchemas = new HashMap<>();
        scenarioOrganizations = new HashMap<>();
        scenarioTables = new ArrayList<>();
        scenarioFeatures = new ArrayList<>();
    }
}
