// Sales statistics controller
// Chỉ đọc dữ liệu từ models, không sửa code cũ
const Order = require('../models/order');
const Book = require('../models/book');
const Genre = require('../models/genres');

const salesController = {
  // Tổng doanh thu, tổng số đơn, tổng sản phẩm, doanh thu trung bình, top sách, doanh thu theo thời gian, theo thể loại
  async getSalesStats(req, res) {
    try {
      // Lấy tất cả đơn hàng đã hoàn thành
      const orders = await Order.find({ status: 'completed' });
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = orders.reduce((sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + (i.quantity || 0), 0) : 0), 0);
  const avgRevenue = totalOrders ? totalRevenue / totalOrders : 0;
      // Top sách bán chạy
      const bookSales = {};
      orders.forEach(o => {
        o.items.forEach(i => {
          // Tương thích cả bookId và book
          const bookId = i.bookId || i.book;
          bookSales[bookId] = (bookSales[bookId] || 0) + i.quantity;
        });
      });
      const topBooksArr = Object.entries(bookSales)
        .filter(([bookId]) => bookId && bookId !== 'undefined')
        .sort((a,b) => b[1]-a[1])
        .slice(0,5);
      const validBookIds = topBooksArr.map(b => b[0]).filter(id => id && id !== 'undefined');
      const topBooks = validBookIds.length > 0 ? await Book.find({ _id: { $in: validBookIds } }) : [];
      // Doanh thu theo ngày/tháng
      const revenueByDate = {};
      orders.forEach(o => {
        // Doanh thu ghi nhận vào ngày hoàn thành (updatedAt)
        const date = o.updatedAt ? o.updatedAt.toISOString().slice(0,10) : 'unknown';
        revenueByDate[date] = (revenueByDate[date] || 0) + (o.total || 0);
      });
      // Doanh thu theo thể loại
      const genreRevenue = {};
      for (const o of orders) {
        if (!o.items) continue;
        for (const i of o.items) {
          const bookId = i.bookId || i.book;
          const book = await Book.findById(bookId);
          if (book && book.genre) {
            genreRevenue[book.genre] = (genreRevenue[book.genre] || 0) + (o.total || 0);
          }
        }
      }
      res.json({
        totalRevenue,
        totalOrders,
        totalProducts,
        avgRevenue,
        topBooks: topBooks.map(b => ({ id: b._id, title: b.title, sold: bookSales[b._id] })),
        revenueByDate,
        genreRevenue
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = salesController;
