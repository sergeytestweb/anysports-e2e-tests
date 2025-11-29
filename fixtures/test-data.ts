export const TestData = {
  baseUrl: 'https://dev.anysports.tv/v2/ru/payment/create/677?p=1',
  
  // емэйл и телефон делаем уникальными для каждого тетса через Math.random
  validOrder: {
    name: 'Sergey',
    email: `test+${Math.floor(Math.random() * 9000) + 1000}@gmail.com`,
    phone: `8029491${Math.floor(Math.random() * 9000) + 1000}`,
    promoCode: 'qa' as string | undefined
  },
  
  // Тестовые карты 
  validCard: {
    cardNumber: '2202000000003055', // Успешный результат
    expiryDate: '1228', // MMYY format
    cvv: '123',
  },
  
  insufficientFundsCard: {
    cardNumber: '2203000000000043', // Недостаточно средств на карте
    expiryDate: '1228',
    cvv: '123',
  }
};