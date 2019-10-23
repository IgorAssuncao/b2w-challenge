import app from './app';

const port = process.env.NODE_ENV.indexOf('test') > -1 ? 3001 : 3000;
app.start = PORT => {
  return app.listen(PORT, '0.0.0.0', () => {
    console.log('API Running on localhost:3000');
  });
};

app.start(port);
