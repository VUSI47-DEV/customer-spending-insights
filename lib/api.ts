import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./api-types";

const fetchClient = createFetchClient<paths>({ baseUrl: "" });
const api = createClient(fetchClient);

export const CUSTOMER_ID = "12345";

export default api;
