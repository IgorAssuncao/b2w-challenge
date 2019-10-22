import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose.connect(`mongodb://mongo/b2w`, {
      useNewUrlParser: true,
    });
  }
}

export default new Database();
