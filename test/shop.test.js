"use strict";

require("chromedriver");
const webdriver = require("selenium-webdriver");  // ucitavanje web drivera
const { By, Key, until } = require("selenium-webdriver");
const chai = require("chai");
const { assert, expect } = require("chai");
const HomePage = require("../pages/home.page");  // ovo je dodato samo od sebe
const RegisterPage = require("../pages/register.page");
const LoginPage = require("../pages/login.page");
const CartPage = require("../pages/cart.page");

describe.only("shop.QA.rs tests", function() {
    let driver;
    let pageHomePage;
    let pageRegister;
    let pageLogin;
    let pageCart;

    const packageToAdd = 'starter';
    const packageQuantity = '2';

    before(function() {
        driver = new webdriver.Builder().forBrowser("chrome").build();
        pageHomePage = new HomePage(driver);
        pageRegister = new RegisterPage(driver);
        pageLogin = new LoginPage(driver);
        pageCart = new CartPage(driver);
    });

    after(async function() {
        await driver.quit();
    });

    // imamo mogucnost da odredjeni deo koda izvrsimo deo koda pre befora i aftera ako sam dobro razumeo

    // pokrece se pre svakog testa
    beforeEach(function() {

    });

    // pokrece se nakon svakog testa
    afterEach(function() {

    });

    it("Verify home page is open", async function() {
        await pageHomePage.goToPage();
        
        const pageTitle = await pageHomePage.getPageHeaderTitle();
        //expect(pageTitle).to.contain("(QA) Shop");

        expect(await pageHomePage.isBugListDivDisplayed()).to.be.true;
    });

    
    it("Goes to registration page", async function() {
        await pageHomePage.clickOnRegisterLink();
        await driver.sleep(3000);
        expect(await pageRegister.getRegisterButtonValue()).to.contain('Register');
    });


    it('Successfully performs registration', async function() {
        await pageRegister.getInputFirstName().sendKeys('Bob');
        
        // ekvivalent reda iznad
        //const inputFirstName = await pageRegister.getInputFirstName();
        //await inputFirstName.sendKeys('Bob');

        await pageRegister.getInputLastName().sendKeys('Buttons');
        await pageRegister.getInputEmail().sendKeys('bob.buttons@example.local');
        await pageRegister.getInputUserName().sendKeys('bob.buttons');
        await pageRegister.getInputPassword().sendKeys('nekaLozinka123');
        await pageRegister.getInputPasswordConfirmation().sendKeys('nekaLozinka123');
    
        await pageRegister.getRegisterButton().click();

        expect(await pageHomePage.getSuccessAlertText()).to.contain('Uspeh!');
    });

    it('Goes to login page', async function () {
        await pageLogin.goToPage();

        await pageLogin.getInputUserName().sendKeys('aaa');
        await pageLogin.getInputPassword().sendKeys('aaa');
        await pageLogin.clickOnLoginButton();
        await driver.sleep(2000);

        expect(await pageHomePage.getWelcomeBackTitle()).to.contain('Welcome back,');

        expect(await pageHomePage.isLogoutLinkDisplayed()).to.be.true;

        await driver.sleep(3000);
    });

    it('Add Item to cart - starter, 2 items', async function() {
    
        const packageDiv = await pageHomePage.getPackageDiv(packageToAdd);
        const quantity = await pageHomePage.getQuantityDropDown(packageDiv);
        const options = await pageHomePage.getQuantityOptions(quantity);

        await Promise.all(options.map(async function(option){
            const text = await option.getText();
            if(text === packageQuantity) {
                await option.click();

                const selectedValue = await quantity.getAttribute('value');
                expect(selectedValue).to.contain('2');

                const buttonOrder = await pageHomePage.getOrderButton(packageDiv);
                await buttonOrder.click();

                expect(await driver.getCurrentUrl()).to.contain('http://shop.qa.rs/order');
            }
        }));
    })

    it("Opens shopping cart", async function() {
        await pageHomePage.clickOnViewShoppingCartLink();

        expect(await driver.getCurrentUrl()).to.contain('http://shop.qa.rs/cart');
        expect(await pageCart.getPageHeaderTitle()).to.contain('Order');
    });

    it("Verifies items are in cart - Starter, 2 items", async function() {
        const orderRow = await pageCart.getOrderRow(packageToAdd);

        const orderQuantity = await pageCart.getOrderQuantity(orderRow);

        expect(await orderQuantity.getText()).to.eq(packageQuantity);
    }); 
});
