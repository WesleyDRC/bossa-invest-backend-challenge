import app from "./app"

const PORT = process.env.port || 5000

app.listen(PORT, () => {
  console.log(`Starting server in port: ${process.env.PORT}`);
});