import axios from 'axios';
import { create } from 'zustand'

const currency_rates_api_url = "https://latest.currency-api.pages.dev/v1/currencies/inr.json";

/* rates type = {
    INR: 1,
    USD: 0.001
}
*/

let retryTime = 2;

export const useCurrencyRatesStore = create((set) => ({
    rates: {},
    date: "",
    loading: false,
    updateRates: async () => {
        try{
            set({ loading: true })
            const response = await axios.get(currency_rates_api_url);
            const data = response.data;
            const currKeys = Object.keys(data.inr);
            data.inr = currKeys.map(key => {
                return {
                    [key.toUpperCase()]: data.inr[key]
                }
            })
            // data.inr = data.
            set({ rates: data.inr || {}, date: data.date || ""})
        }catch(err){
            if(retryTime > 0){
                this.updateRates();
                retryTime--;
            }
        }finally{
         set({ loading: false })
        }
    }
}))