
import axios from 'axios';

export const api = axios.create({
   // baseURL: process.env.API_BASE_URL
   baseURL: 'https://trip-backend-2453763a8b77.herokuapp.com'
})