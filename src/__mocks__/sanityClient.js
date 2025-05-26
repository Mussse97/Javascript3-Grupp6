export const client = {
  fetch: (query) => {
    if (query.includes('order(_createdAt desc)')) {
      return Promise.resolve([
        {
          _id: '1',
          title: 'Senaste inlägget 1',
          category: 'film',
          imageUrl: null,
          body: [{ _type: 'block', children: [{ text: 'Det här är senaste inlägget 1' }] }],
          _createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          title: 'Senaste inlägget 2',
          category: 'musik',
          imageUrl: null,
          body: [{ _type: 'block', children: [{ text: 'Det här är senaste inlägget 2' }] }],
          _createdAt: new Date().toISOString(),
        },
      ]);
    }
    if (query.includes('order(likes desc)')) {
      return Promise.resolve([
        {
          _id: '3',
          title: 'Populärt inlägg 1',
          category: 'spel',
          imageUrl: 'https://via.placeholder.com/150',
          body: [{ _type: 'block', children: [{ text: 'Populärt och trendigt inlägg 1' }] }],
          likes: 100,
        },
      ]);
    }
    // Här lägger vi till mockdata för SinglePost-komponenten
    if (query.includes('*[_type == "post" && slug.current ==')) {
      return Promise.resolve({
        _id: "mock-post-id",
        title: "Testinlägg",
        year: 2024,
        producer: "Testproducent",
        category: { title: "Film" },
        genres: [{ title: "Drama" }, { title: "Action" }],
        body: "Det här är en test-body.",
        comments: [
          {
            name: "Testare",
            comment: "Detta är en testkommentar.",
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }
    return Promise.resolve([]);
  },
};

// Mock för writeClient
export const writeClient = {
  patch: () => ({
    setIfMissing: () => ({
      append: () => ({
        commit: () => Promise.resolve(),
      }),
    }),
  }),
};
// 