const Order = require('../models/order');
const Cart = require('../models/cart');
const Book = require('../models/book');
const order = require('../models/order');

exports.createFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: userId }).populate('items.book');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Validate stock again and prepare items
    for (const item of cart.items) {
      const book = await Book.findById(item.book._id);
      if (!book || book.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${item.book.title}` });
    }

    const orderItems = cart.items.map(i => ({
      book: i.book._id,
      title: i.book.title,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
    }));

    const subtotal = cart.subtotal;
    const shippingFee = 0;
    const total = subtotal + shippingFee;

    const order = new Order({ createdBy: userId, user: userId, items: orderItems, subtotal, shippingFee, total, shippingAddress });
    await order.save();

    // Deduct stock
    for (const item of cart.items) {
      await Book.findByIdAndUpdate(item.book._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    cart.items = [];
    cart.subtotal = 0;
    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating order', error: err });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ $or: [{ user: userId }, { createdBy: userId }] }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching orders', error: err });
  }
};

// Manual create by shop owner (admin)
exports.createManual = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { customerName, customerPhone, customerEmail, customerAddress, items, shippingFee = 0 } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Items required' });

    // Validate and construct items
    const orderItems = [];
    let subtotal = 0;
    for (const i of items) {
      const book = await Book.findById(i.bookId);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      if (book.stock < i.quantity) return res.status(400).json({ message: `Insufficient stock for ${book.title}` });
      const unitPrice = book.price;
      const lineTotal = unitPrice * i.quantity;
      orderItems.push({ book: book._id, title: book.title, unitPrice, quantity: i.quantity, lineTotal });
      subtotal += lineTotal;
    }

    const total = subtotal + shippingFee;
    const order = new Order({
      createdBy: ownerId,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      status: 'pending',
    });
    await order.save();

    // Deduct stock
    for (const i of items) {
      await Book.findByIdAndUpdate(i.bookId, { $inc: { stock: -i.quantity } });
    }

    return res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating order', error: err });
  }
};

// List all orders for owner
exports.listAll = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("createdBy", "username");
    return res.status(200).json(orders.map(order => ({
      _id: order._id,
      createdBy: order.createdBy.username,
      items: order.items,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      status: order.status
    })));
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching orders', error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params
    const orderDetail = await Order.findById(id).populate("createdBy", "username")
    return res.status(200).json({
      _id: orderDetail._id,
      createdBy: orderDetail.createdBy.username,
      items: orderDetail.items,
      subtotal: orderDetail.subtotal,
      shippingFee: orderDetail.shippingFee,
      total: orderDetail.total,
      status: orderDetail.status
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error finding order', error: err });
  }
}

exports.updateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status, updatedAt: Date.now() }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ message: 'Order updated', order });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating order', error: err });
  }

};


