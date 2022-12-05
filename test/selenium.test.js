"use strict";

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
};

require("chromedriver");
const webdriver = require("selenium-webdriver");  // ucitavanje web drivera
const { By, Key, until } = require("selenium-webdriver");

const chai = require("chai");
const { describe } = require("mocha");
const { expect } = require("chai");
const assert = chai.assert;  // koriscenje chai biblioteke umesto mochinog aserta


describe("Selenium tests", function() {
    let driver;  // moramo da inicijalizujemo drajver

    before(function() {
        driver = new webdriver.Builder().forBrowser("chrome").build();
    });  
    
    after(async function() {
        await driver.quit();
    });

    it("Open qa.rs website", async function() {
        await driver.get("https://qa.rs");

        await delay(5000);

        const pageTitle = await driver.getTitle();

        expect(pageTitle).to.contain("QA.rs");

        assert.equal(pageTitle, 'Edukacija za qa testere - qa.rs');

        //assert.notEqual([pageTitle, 'Edukacija za qa testere - qa.rs']);
    });

    it("Open google.com", async function() {
        await driver.get("https://google.com");
        expect(pageTitle).to.contain("Google");
    });

    it("Perform a search on google", async () => {
        expect(await driver.getTitle()).to.contain("Google");

        const inputSearch = await driver.findElement(By.name("q"));
        inputSearch.click();
        inputSearch.sendKeys("qa.rs", Key.ENTER);

        await driver.wait(until.elementLocated(By.id("search")));
        await driver.sleep(3000);
        expect(await driver.getTitle()).to.contain("qa.rs");

        await delay(3000);

    });

    it("Go to next page of search results", async function() {
        expect(await driver.getTitle()).to.contain("qa.rs");
        const navigation = await driver.findElement(By.xpath('(//div[@role="navigation"])[2]'));
        const nextPage = navigation.findElement(By.id("pnnext"));
        nextPage.click();
        await driver.wait(until.elementLocated(By.id("search")));
        expect(await driver.getTitle()).to.contain("qa.rs");
    });
});

