import axios from "axios";

const API_BASE = "http://20.127.168.25:5000/api"; 

export const api = axios.create({
  baseURL: API_BASE,
});
