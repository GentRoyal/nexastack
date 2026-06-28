const BASE = "http://127.0.0.1:8000" || "https://nexastack-api.onrender.com/";

const get = (path) => fetch(`${BASE}${path}`).then(r => r.json());

export const getDashboard   = () => get("/dashboard");
export const getCustomers   = () => get("/customers");
export const getCustomer    = (id) => get(`/customers/${id}`);
export const getPipeline    = () => get("/pipeline");
export const getSegments    = () => get("/segments");
export const getCampaigns   = () => get("/campaigns");
export const getInsights    = () => get("/insights");