jest.mock("mongodb", () => {
  return {
    MongoClient: class MongoClient {
      connect() {
        return Promise.resolve({
          db: () => {},
        });
      }
    },
  };
});
