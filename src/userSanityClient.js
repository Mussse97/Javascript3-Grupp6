import sanityClient from "@sanity/client";

export const userClient = sanityClient({
    projectId: 'vjiz9cdi',
    dataset: 'production',
    apiVersion: '2024-05-13',
    useCdn: false, // måste vara false för writes
    token: import.meta.env.VITE_SANITY_TOKEN,
});