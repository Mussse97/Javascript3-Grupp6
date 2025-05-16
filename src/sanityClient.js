// src/sanityClient.js
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "vjiz9cdi", // t.ex. "abc123"
  dataset: "production",
  apiVersion: "2024-05-13", // eller dagens datum
  useCdn: true,
});
