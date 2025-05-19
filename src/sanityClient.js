import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "vjiz9cdi", // t.ex. "abc123"
  dataset: "production",
  apiVersion: "2024-05-13", // eller dagens datum
  useCdn: false,
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN, // lägg in din token i en env-fil
});
