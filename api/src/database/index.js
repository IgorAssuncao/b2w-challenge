import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    if (process.env.NODE_ENV !== 'test') {
      const mongoUrl = `mongodb://mongo/b2w`;

      setTimeout(() => {
        this.mongoConnection = mongoose.connect(mongoUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      }, 10000);
    }
  }
}

export default new Database();
