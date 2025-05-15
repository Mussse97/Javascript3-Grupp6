// src/sanityClient.js
import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: 'vjiz9cdi', // t.ex. "abc123"
  dataset: 'production',
  apiVersion: '2024-05-13', // eller dagens datum
  useCdn: true,
});
