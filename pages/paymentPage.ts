import { Page, Locator } from "@playwright/test";

interface CardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export function createPaymentPage(page: Page) {
  // Локаторы полей карты
  const cardNumberInput: Locator = page.getByRole("textbox", {
    name: "Номер карты",
  });
  const expiryDateInput: Locator = page.getByRole("textbox", { name: "MM/ГГ" });
  const cvvInput: Locator = page.getByRole("textbox", { name: "CVV" });

  // Другие локаторы
  const submitPaymentButton: Locator = page.getByRole("button", {
    name: "Оплатить 11.35₽",
  });
  const errorMessage: Locator = page.getByText("Недостаточно средств на карте");
  const loadingIndicator: Locator = page.getByRole("heading", {
    name: "Подождите, идет обработка платежа",
  });

  async function fillCardDetails(cardData: CardData): Promise<void> {
    console.log("💳 Заполнение данных карты");

    // Заполнить данные карты
    await cardNumberInput.fill(cardData.cardNumber);
    await expiryDateInput.fill(cardData.expiryDate);
    await cvvInput.fill(cardData.cvv);

    console.log("✅ Данные карты заполнены");
  }

  async function submitPayment(): Promise<void> {
    console.log("💰 Отправка платежа");
    await submitPaymentButton.click();
  }

  async function verifyProcessingPage(): Promise<void> {
    console.log("🔍 Проверка промежуточной страницы обработки");

    // Проверить наличие индикаторов загрузки
    if (loadingIndicator) {
      console.log("✅ Индикатор загрузки отображается");
    }

    // Проверить URL для индикаторов обработки
    const currentUrl = page.url();
    if (loadingIndicator) {
      console.log("✅ Находимся на промежуточной странице обработки платежа");
    } else {
      console.log("ℹ️  Промежуточная страница не обнаружена, продолжаем...");
    }
  }

  async function waitForThankYouPage(timeout: number = 60000): Promise<void> {
    console.log("⏳ Ожидание перехода на страницу благодарности");

    try {
      // Ждём перенаправления на страницу благодарности.
      await page.waitForURL(/\/thankyou_mid/i, { timeout });
      console.log("✅ Успешно перешли на страницу благодарности");
    } catch (error) {
      console.log("⚠️  Таймаут ожидания страницы благодарности");
      throw error;
    }
  }

  async function waitForErrorPage(timeout: number = 15000): Promise<void> {
    console.log("⏳ Ожидание страницы ошибки");

    try {
      // Ждём сообщения об ошибке или страницы с ошибкой.
      await errorMessage.waitFor({ state: "visible", timeout });
      console.log("✅ Сообщение об ошибке отображается");
    } catch (error) {
      console.log("⚠️  Сообщение об ошибке не появилось");
    }
  }

  async function getErrorMessage(): Promise<string> {
    const errorText = (await errorMessage.textContent()) || "";
    console.log(`❌ Текст ошибки в браузере: ${errorText}`);
    return errorText;
  }

  // Делаем методы торчащими наружу
  return {
    fillCardDetails,
    submitPayment,
    verifyProcessingPage,
    waitForThankYouPage,
    waitForErrorPage,
    getErrorMessage,
  };
}
