const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require("morgan");
const createError = require("http-errors");
const bookRoutes = require('./routes/bookRoutes')
const communityRoutes = require('./routes/communityRoutes')
const favoriteRoutes = require('./routes/favoritesRoutes')
const genresRoutes = require('./routes/genresRoutes')
const postRoutes = require('./routes/postRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const userRoutes = require('./routes/userRoutes')
const salesRoutes = require('./routes/salesRoutes')

const connectDB = require('./config/db');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use('/book', bookRoutes);
app.use('/community', communityRoutes)
app.use('/favorite', favoriteRoutes)
app.use('/genres', genresRoutes)
app.use('/post', postRoutes)
app.use('/review', reviewRoutes),
  app.use('/user', userRoutes)
app.use('/cart', cartRoutes)
app.use('/order', orderRoutes)
app.use('/sales', salesRoutes)
const PORT = 9999;

// app.use(async (req, res, next) => {
//   next(createError.BadRequest("Error: Bad request"));
//   next(createError(404, "Error: Not Found"));
// });
// Kiem soat loi bat ky: 4x or 5x
app.use(async (err, req, res, next) => {
  // Lay status code thuc te dang gap phai
  res.status(err.status || 500);
  res.json({
    "error": {
      status: err.status,
      message: err.message,
    }
  });
});
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
