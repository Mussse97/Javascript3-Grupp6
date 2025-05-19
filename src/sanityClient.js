
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "vjiz9cdi", // t.ex. "abc123"
  dataset: "production",
  apiVersion: "2024-05-13", // eller dagens datum
  useCdn: true,
});


export const writeClient = createClient({
  projectId: 'vjiz9cdi',
  dataset: 'production',
  apiVersion: '2024-05-13',
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN, 
  useCdn: false, // skrivning = aldrig CDN
});