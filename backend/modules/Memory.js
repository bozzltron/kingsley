const { MongoClient } = require("mongodb");

// Connection URL
const url = process.env.MONGODB_CONNECTION;
const client = new MongoClient(url);
let connection;

const Memory = {
  connect: async () => {
    if (!connection) {
      connection = await client.connect();
    }
    return client.db("kingsley");
  },
  getMemory: async () => {
    const db = await Memory.connect();
    return db.collection("memory");
  },
  find: async (query) => {
    const memory = await Memory.getMemory();
    let records = await memory.find(query);
    let array = await records.toArray();
    return array;
  },
  search: async (statement) => {
    const memory = await Memory.getMemory();
    let records = await memory
      .find(
        { $text: { $search: statement } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } });
    let array = await records.toArray();
    return array;
  },
  create: async (document) => {
    const memory = await Memory.getMemory();
    return memory.insertOne(document);
  },
  updateOne: async (query, document) => {
    const memory = await Memory.getMemory();
    return memory.updateOne(query, { $set: document });
  },
  deleteOne: async (query) => {
    const memory = await Memory.getMemory();
    return memory.deleteOne(query);
  },
};

module.exports = Memory;
