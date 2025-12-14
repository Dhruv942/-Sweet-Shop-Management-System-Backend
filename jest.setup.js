process.env.NODE_ENV = "test";

jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    ...actualMongoose,
    connect: jest.fn(() => Promise.resolve(actualMongoose)),
    connection: {
      readyState: 0, // disconnected
    },
  };
});
