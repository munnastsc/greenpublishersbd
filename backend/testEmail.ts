import { sendOrderNotification } from './src/utils/EmailService';

const mockOrder = {
  customerName: 'Test User',
  customerPhone: '01XXXXXXXXX',
  address: 'Test Address',
  paymentMethod: 'COD',
  totalAmount: 100,
  items: JSON.stringify([{ titleEn: 'Test Book', quantity: 1 }])
};

sendOrderNotification(mockOrder).then(() => {
  console.log('Test completed');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
