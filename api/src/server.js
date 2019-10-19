import app from './app';

app.start = () => {
  return app.listen(3000, '0.0.0.0', () => {
    console.log('API Running on localhost:3000');
  });
};

app.start();
