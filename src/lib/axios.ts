
import axios from 'axios';
import { API_URL } from '../config/config';

export const api = axios.create({
   // baseURL: 'http://localhost:3333'
   baseURL: API_URL
})