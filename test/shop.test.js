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
const CheckoutPage = require("../pages/checkout.page");
const HistoryPage = require("../pages/history.page");

describe.only("shop.QA.rs tests", function() {
    let driver;
    let pageHomePage;
    let pageRegister;
    let pageLogin;
    let pageCart;
    let pageCheckout;
    let pageHistory;

    const packageToAdd = 'starter';
    const packageQuantity = '2';

    before(function() {
        driver = new webdriver.Builder().forBrowser("chrome").build();
        pageHomePage = new HomePage(driver);
        pageRegister = new RegisterPage(driver);
        pageLogin = new LoginPage(driver);
        pageCart = new CartPage(driver);
        pageCheckout = new CheckoutPage(driver);
        pageHistory = new HistoryPage(driver);
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

    it('Clean up leftover cart items', async function() {
        await pageCart.goToPage();
        await pageCart.clickOnCheckoutButton();

        expect(await pageCheckout.getCheckoutSuccessTitle()).to.contain('(Order #)');
        await pageHomePage.goToPage();
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

        const itemQuantity = await pageCart.getItemQuantity(orderRow);

        expect(await itemQuantity.getText()).to.eq(packageQuantity);
    });

    // domaci da li ukupna cena odgovara ukupnoj ceni (total u donjem uglu tabele shop.qa.rs/cart)
    it("Verifies total item price is correct", async function() {
        const orderRow = await pageCart.getOrderRow(packageToAdd);
        const itemQuantity = await pageCart.getItemQuantity(orderRow);
        const itemPrice = await pageCart.getItemPrice(orderRow);
        const itemPriceTotal = await pageCart.getItemPriceTotal(orderRow);

        const qntty = Number(await itemQuantity.getText());  // pretvara string u number
        const price = Number((await itemPrice.getText()).substring(1));  // preskace deo karaktera $300 preskace dolar znak
        const total = Number((await itemPriceTotal.getText()).substring(1));

        //const price2 = (await itemPrice.getText()).replace(/\D/g, ''); \D sve sto nije broj izbaci ga iz stringa - regex izraz - regularni izraz

        const calculatedItemPriceTotal = qntty * price;

        expect(calculatedItemPriceTotal).to.be.eq(total);
    });

    it("Performs checkout", async function() {
        await pageCart.clickOnCheckoutButton();

        expect(await pageCheckout.getCheckoutSuccessTitle()).to.contain('(Order #)');
    });

    it("Verifies checkout success", async function() {
        const orderNumber = pageCheckout.getCheckoutOrderNumber();

        await pageCheckout.clickOnGetOrderHistoryLink();

        expect(await pageHistory.getPageHeaderTitle()).to.contain('Order history');

        const historyRow = await pageHistory.getHistoryRow(orderNumber);
        const historyStatus = await pageHistory.getHistoryStatus(historyRow).getText();

        expect(historyStatus).to.be.eq('Oredered');

        // domaci odradi logaout
    });

    it("Performs logout", async function() {
        await pageHistory.clickOnLogoutLink();

        expect(await pageHomePage.isLoginLinkDisplayed()).to.be.true;
    });
});
