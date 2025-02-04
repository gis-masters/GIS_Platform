package main;

import io.cucumber.datatable.DataTable;
import io.cucumber.docstring.DocString;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static java.lang.Thread.sleep;

@SuppressWarnings("unused")
public class ExampleSteps {
    @Given("^this is a given step$")
    public void thisIsAGivenStep() throws InterruptedException {
        sleep(1000);
    }

    @When("^I do something$")
    public void iDoSomething() throws InterruptedException {
        sleep(1000);
    }

    @Then("^I expect a result$")
    public void iExpectAResult() throws InterruptedException {
        sleep(1000);
    }

    @And("^I expect a second result$")
    public void iExpectASecondResult() throws InterruptedException {
        sleep(1000);
    }

    @When("^I do something with data$")
    public void iDoSomethingWithData(DataTable dataTable) throws InterruptedException {
        sleep(1000);
    }

    @Given("^this is a background step with data$")
    public void thisIsABackgroundStepWithData(DataTable dataTable) throws InterruptedException {
        sleep(1000);
    }

    @And("^this is a background step$")
    public void thisIsABackgroundStep() throws InterruptedException {
        sleep(1000);
    }

    @Given("^I am on a page with text '(.*)'$")
    public void iAmOnAPageWithTextText(String text) throws InterruptedException {
        sleep(1000);
    }
}