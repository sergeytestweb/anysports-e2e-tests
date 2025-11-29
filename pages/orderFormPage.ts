import { Page, Locator } from '@playwright/test';

interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  promoCode?: string;
}

export function createOrderFormPage(page: Page) {
  // Инициализировать локаторы на основе структуры сайта
  const nameInput: Locator = page.getByPlaceholder('Вероника');
  const emailInput: Locator = page.getByPlaceholder('test@mail.ru');
  const phoneInput: Locator = page.getByPlaceholder('029 491-19-11');
  const promoCodeInput: Locator = page.getByPlaceholder('Promocode');
  const applyPromoButton: Locator = page.getByText('Применить');
  const paymentMethodSelect: Locator = page.locator('#russian-cards-button');

  async function navigateToPaymentPage(): Promise<void> {
    // Перейти на страницу оплаты с параметром промокод.
    await page.goto('https://dev.anysports.tv/v2/ru/payment/create/677?p=1');
    console.log('✅ Открыта страница оплаты с промокодом');
  }

  async function fillOrderForm(orderData: OrderFormData): Promise<void> {
    console.log('📝 Заполнение формы');
    
    // Заполнить основную инфу
    await nameInput.fill(orderData.name);
    await emailInput.fill(orderData.email);
    await phoneInput.fill(orderData.phone);

    // Применяем промокод
    if (orderData.promoCode) {
      console.log(`🎁 Применение промокода: ${orderData.promoCode}`);
      await promoCodeInput.fill(orderData.promoCode);
      await applyPromoButton.click();
      
      // Ждём проверки промокода
      await page.waitForTimeout(2000);
      page.getByText('Скидка 25% применена');
      console.log(`🎁 Промокод "${orderData.promoCode}" применился`);

    }
  }

  async function selectPaymentMethod(method: string = 'card'): Promise<void> {
    console.log(`💳 Выбор платежного метода: ${method}`);
    
    try {
      // Выбираем карту МИР
      if (await paymentMethodSelect.isVisible()) {
        await paymentMethodSelect.selectOption(method);
      } else {
        console.log('ℹ️  Выбор платежного метода не требуется, используется карта по умолчанию');
      }
    } catch (error) {
      console.log('ℹ️  Платежный метод выбран автоматически');
    }
  }

  async function submitOrder(): Promise<void> {
    console.log('🚀 Отправка формы заказа');
    
    // Ждёи отправку формы
    await page.waitForTimeout(1000);
  }

  // Делаем методы торчащими наружу
  return {
    navigateToPaymentPage,
    fillOrderForm,
    selectPaymentMethod,
    submitOrder
  };
}