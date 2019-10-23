import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    const mongoUrl =
      process.env.NODE_ENV.indexOf('test') > -1
        ? `mongodb://127.0.0.1/b2w-test`
        : `mongodb://mongo/b2w`;

    this.mongoConnection = mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
