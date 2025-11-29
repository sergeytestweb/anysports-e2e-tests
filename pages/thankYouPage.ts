import { Page, Locator } from '@playwright/test';

export function createThankYouPage(page: Page) {
  // Locators for success page
  const successMessage: Locator = page.locator('h1, h2, .success, .thankyou_mid, :text("Спасибо"), :text("Thank")');

  async function verifyThankYouPage(): Promise<void> {
    console.log('🔍 Проверка страницы благодарности');
    
    // Проверить, что URL содержит индикаторы успеха
    const currentUrl = page.url();
    const isThankYouPage = currentUrl.includes('/thankyou_mid') || 
                          currentUrl.includes('/success') ||
                          currentUrl.includes('/complete');
    
    if (!isThankYouPage) {
      console.log(`⚠️  URL не указывает на страницу успеха: ${currentUrl}`);
    }
    
    // Проверить, отображается ли сообщение об успешном завершении.
    await successMessage.waitFor({ state: 'visible', timeout: 60000 });
    const message = await successMessage.textContent();
    console.log(`✅ Сообщение: ${message}`);
        
    console.log('✅ Страница благодарности успешно загружена');
  }

  async function getSuccessMessage(): Promise<string> {
    return await successMessage.textContent() || '';
  }

  // Делаем методы торчащими наружу
  return {
    verifyThankYouPage,
    getSuccessMessage
  };
}