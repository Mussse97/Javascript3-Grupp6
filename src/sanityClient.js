// src/sanityClient.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'vjiz9cdi',
  dataset: 'production',
  apiVersion: '2024-05-13',
  useCdn: false,
  token: 'DIN_WRITE_TOKEN' // byt ut till riktig token
});

export default client; // ✅ Viktigt! default-export
