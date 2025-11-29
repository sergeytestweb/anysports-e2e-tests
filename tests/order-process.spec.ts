// tests/order-process.spec.ts
import { test, expect } from "@playwright/test";
import { createOrderFormPage } from "../pages/orderFormPage";
import { createPaymentPage } from "../pages/paymentPage";
import { createThankYouPage } from "../pages/thankYouPage";
import { TestData } from "../fixtures/test-data";

test.describe("E2E тесты процесса создания заказа", () => {
  test("ПОЗИТИВНЫЙ СЦЕНАРИЙ: Успешная оплата с промокодом", async ({
    page,
  }) => {
    console.log("🚀 ЗАПУСК ПОЗИТИВНОГО СЦЕНАРИЯ");

    // Инициализация page objects через функции
    const orderFormPage = createOrderFormPage(page);
    const paymentPage = createPaymentPage(page);
    const thankYouPage = createThankYouPage(page);

    // Шаг 1: Открыть страницу оплаты с промокодом
    console.log("📝 ШАГ 1: Открытие страницы оплаты");
    await orderFormPage.navigateToPaymentPage();

    // Проверяем что страница загрузилась
    await expect(page).toHaveURL(/payment\/create\/677/);
    console.log("✅ Страница оплаты успешно загружена");

    // Шаг 2: Заполнить форму заказа с промокодом
    console.log("📝 ШАГ 2: Заполнение формы заказа");
    await orderFormPage.fillOrderForm(TestData.validOrder);

    // Шаг 3: Выбрать платежный способ Visa МИР
    console.log("📝 ШАГ 3: Выбор платежного способа");
    await orderFormPage.selectPaymentMethod("card");

    // Шаг 4: Ждем загрузки платежной формы
    console.log("📝 ШАГ 4: Ждем загрузки платежной формы");
    await page.waitForTimeout(3000);

    // Шаг 5: Заполнить данные валидной карты
    console.log("📝 ШАГ 5: Заполнение данных карты");
    await page.locator("#russian-cards-button").click();
    await paymentPage.fillCardDetails(TestData.validCard);

    // Шаг 6: Нажать оплатить
    console.log("📝 ШАГ 6: Отправка платежа");
    await paymentPage.submitPayment();

    // Шаг 7: Проверить промежуточную страницу обработки
    console.log("🔍 ШАГ 7: Проверка промежуточной страницы");
    await paymentPage.verifyProcessingPage();

    // Шаг 8: Дождаться страницы "Спасибо"
    console.log("🔍 ШАГ 8: Промежуточная страница спасибо с допродажами");
    await paymentPage.waitForThankYouPage();

    // Шаг 9: Проверить элементы страницы "Спасибо"
    console.log("🔍 ШАГ 9: Проверка страницы благодарности");
    await thankYouPage.verifyThankYouPage();

    // Финальная проверка успешного сообщения
    const successMessage = await thankYouPage.getSuccessMessage();
    expect(successMessage.toLowerCase()).toMatch(/спасибо|успешно|thank/i);

    console.log("🎉 ПОЗИТИВНЫЙ СЦЕНАРИЙ УСПЕШНО ЗАВЕРШЕН!");
  });

  test("НЕГАТИВНЫЙ СЦЕНАРИЙ: Ошибка оплаты из-за недостатка средств", async ({
    page,
  }) => {
    console.log("🚨 ЗАПУСК НЕГАТИВНОГО СЦЕНАРИЯ");

    // Инициализация page objects через фабричные функции
    const orderFormPage = createOrderFormPage(page);
    const paymentPage = createPaymentPage(page);

    // Шаг 1: Открыть страницу оплаты
    console.log("📝 ШАГ 1: Открытие страницы оплаты");
    await orderFormPage.navigateToPaymentPage();

    // Шаг 2: Заполнить форму заказа
    console.log("📝 ШАГ 2: Заполнение формы заказа");
    await orderFormPage.fillOrderForm(TestData.inValidOrder);

    // Шаг 3: Выбрать платежный способ
    console.log("📝 ШАГ 3: Выбор платежного способа");
    await orderFormPage.selectPaymentMethod("card");

    // Шаг 4: Отправить форму заказа
    console.log("📝 ШАГ 4: Отправка формы заказа");
    await orderFormPage.submitOrder();

    // Ждем загрузки платежной формы
    await page.waitForTimeout(3000);

    // Шаг 5: Заполнить данные карты с недостатком средств
    console.log("📝 ШАГ 5: Заполнение данных карты с недостатком средств");
    await page.locator("#russian-cards-button").click();
    await paymentPage.fillCardDetails(TestData.insufficientFundsCard);

    // Шаг 6: Отправить платеж
    console.log("📝 ШАГ 6: Отправка платежа");
    await paymentPage.submitPayment();

    // Шаг 7: Проверить что появилась ошибка
    console.log("🔍 ШАГ 7: Проверка ошибки оплаты");
    await paymentPage.waitForErrorPage();

    // Шаг 8: Проверить текст ошибки
    console.log("🔍 ШАГ 8: Проверка сообщения об ошибке");
    const errorText = await paymentPage.getErrorMessage();

    // Проверяем что ошибка связана с недостатком средств или отклонением
    const isExpectedError =
      errorText.toLowerCase().includes("недостаточно") ||
      errorText.toLowerCase().includes("средств") ||
      errorText.toLowerCase().includes("на карте") ||
      errorText.toLowerCase().includes("declined");

    expect(isExpectedError).toBeTruthy();

    console.log("✅ НЕГАТИВНЫЙ СЦЕНАРИЙ УСПЕШНО ЗАВЕРШЕН!");
    console.log(`❌ Ошибка оплаты: ${errorText}`);
  });
});
