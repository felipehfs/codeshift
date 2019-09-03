const app = require("./config/express");

const PORT = 3001;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));