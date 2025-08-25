const Cart = require('../models/cart');
const Book = require('../models/book');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.book');
    return res.status(200).json(cart || { user: userId, items: [], subtotal: 0 });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching cart', error: err });
  }
};

exports.addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, quantity } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const idx = cart.items.findIndex(i => String(i.book) === String(bookId));
    const qty = Number(quantity) || 1;
    const unitPrice = book.price;
    if (idx >= 0) {
      cart.items[idx].quantity += qty;
      cart.items[idx].lineTotal = cart.items[idx].quantity * unitPrice;
    } else {
      cart.items.push({ book: bookId, quantity: qty, unitPrice, lineTotal: qty * unitPrice });
    }

    cart.subtotal = cart.items.reduce((s, i) => s + i.lineTotal, 0);
    cart.updatedAt = Date.now();
    await cart.save();
    return res.status(200).json({ message: 'Added to cart', cart });
  } catch (err) {
    return res.status(500).json({ message: 'Error adding to cart', error: err });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const idx = cart.items.findIndex(i => String(i.book) === String(bookId));
    if (idx < 0) return res.status(404).json({ message: 'Item not found' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const qty = Number(quantity);
    if (qty <= 0) {
      cart.items.splice(idx, 1);
    } else {
      if (book.stock < qty) return res.status(400).json({ message: 'Insufficient stock' });
      cart.items[idx].quantity = qty;
      cart.items[idx].unitPrice = book.price;
      cart.items[idx].lineTotal = qty * book.price;
    }
    cart.subtotal = cart.items.reduce((s, i) => s + i.lineTotal, 0);
    cart.updatedAt = Date.now();
    await cart.save();
    return res.status(200).json({ message: 'Cart updated', cart });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating cart', error: err });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndUpdate({ user: userId }, { items: [], subtotal: 0, updatedAt: Date.now() }, { upsert: true });
    return res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    return res.status(500).json({ message: 'Error clearing cart', error: err });
  }
};


