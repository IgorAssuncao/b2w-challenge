import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    const mongoUrl =
      process.env.NODE_ENV === 'test'
        ? `mongodb://foobar/baz`
        : `mongodb://mongo/b2w`;

    setTimeout(() => {
      this.mongoConnection = mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }, 5000);
  }
}

export default new Database();
