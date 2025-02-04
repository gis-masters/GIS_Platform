package ru.mycrg.acceptance;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(plugin = {"pretty", "ru.mycrg.acceptance.TestEventHandlerPlugin"})
public class RunCucumberTest {

}
