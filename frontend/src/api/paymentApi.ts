import { apiClient } from './axios'

export interface CheckoutResponse {
  checkoutUrl: string
  sessionId: string
}

export const paymentApi = {
  createCheckoutSession: async (planType: 'MONTHLY' | 'ANNUAL' | 'LIFETIME', email?: string): Promise<CheckoutResponse> => {
    const res = await apiClient.post<{ data: CheckoutResponse }>('/payments/create-checkout-session', {
      planType,
      email: email || 'trader@example.com',
    })
    return res.data.data
  },
}
