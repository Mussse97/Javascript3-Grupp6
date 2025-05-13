import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "ovrozqx7",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: true,
});
