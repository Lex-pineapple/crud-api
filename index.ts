import server from './src/server.ts';

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
