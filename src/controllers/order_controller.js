//customer model

const order =  require('../models/order/order_model');
const orderDetail = require('../models/order/order_detail_model'); 



const OrderController = {

createOrderDetail: async (req, res) => {
    try {
      const { orderId, productId, quantity, price } = req.body || {};

      const oId = Number(orderId);
      const pId = Number(productId);
      const qty = Number(quantity);
      const pr = Number(price);

      if (!Number.isInteger(oId) || oId <= 0) return res.status(400).json({ error: 'orderId required' });
      if (!Number.isInteger(pId) || pId <= 0) return res.status(400).json({ error: 'productId required' });
      if (!Number.isInteger(qty) || qty <= 0) return res.status(400).json({ error: 'quantity required and must be integer > 0' });
      if (!Number.isFinite(pr) || pr < 0) return res.status(400).json({ error: 'price required and must be non-negative' });

      const created = await orderDetail.createOrderDetail(oId, pId, qty, pr);
      if (!created) return res.status(500).json({ error: 'Create order detail failed' });

      return res.status(201).json({ success: true, OrderDetailID: created.OrderDetailID });
    } catch (err) {
      console.error('createOrderDetail error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  getOrderDetailsByOrderId: async (req, res) => {
    try {
      const orderIdRaw = req.params.orderId ;
      const orderId = Number(orderIdRaw);
      if (!Number.isInteger(orderId) || orderId <= 0) return res.status(400).json({ error: 'orderId required' });

      const list = await orderDetail.getOrderDetailsByOrderId(orderId);
      return res.json(list);
    } catch (err) {
      console.error('getOrderDetailsByOrderId error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  createOrder: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ error: 'userId required' });
      }

      const {
        addressId,
        addressName = '',
        voucherId = null,
        totalAmount,
        discountAmount = 0
      } = req.body || {};

      const aId = Number(addressId);
      const total = Number(totalAmount);
      const discount = Number(discountAmount);

      if (!Number.isInteger(aId) || aId <= 0) return res.status(400).json({ error: 'addressId required' });
      if (!Number.isFinite(total) || total < 0) return res.status(400).json({ error: 'totalAmount required' });
      const orderId = await order.createOrder(
        userId,
        aId,
        addressName,
        voucherId,
        total,
        discount
      );

      if (!orderId) return res.status(500).json({ error: 'Create order failed' });
      return res.status(201).json({ success: true, OrderID: orderId });
    } catch (err) {
      console.error('createOrder error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  getOrdersByUserAndStatus: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      const status = String(req.query.status ?? '').trim();
      if (!Number.isInteger(userId) || userId <= 0) return res.status(400).json({ error: 'userId required' });
      

      const list = await order.getOrdersByUserAndStatus(userId, status);
      return res.json(list);
    } catch (err) {
      console.error('getOrdersByUserAndStatus error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  
  getOrdersByStatus: async (req, res) => {
    try {
     
      const status = String(req.query.status ?? '').trim();
      if (!status) return res.status(400).json({ error: 'orderStatus required' });

      const list = await order.getOrdersByStatus(status);
      return res.json(list);
    } catch (err) {
      console.error('getOrdersByStatus error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  
  updateOrderStatus: async (req, res) => {
    try {

      const {orderId, status} = req.body || {};

      if (!Number.isInteger(orderId) || orderId <= 0) return res.status(400).json({ error: 'orderId required' });
      if (!status) return res.status(400).json({ error: 'orderStatus required' });

      const ok = await order.updateOrderStatus(orderId, status);
      if (!ok) return res.status(400).json({ error: 'Update failed or no rows affected' });
      return res.json({ success: true, message: 'Order status updated' });
    } catch (err) {
      console.error('updateOrderStatus error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  getRevenueToday: async (req, res) => {
    try {
      
      const revenue = await order.getRevenueToday();
      return res.json({ revenue });
    } catch (err) {
      console.error('getRevenueToday error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  getRevenueCurrentMonth: async (req, res) => {
    try {
     
      const revenue = await order.getRevenueCurrentMonth();
      return res.json({ revenue });
    } catch (err) {
      console.error('getRevenueCurrentMonth error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  getRevenueCurrentQuarter: async (req, res) => {
    try {
     
      const revenue = await order.getRevenueCurrentQuarter();
      return res.json({ revenue });
    } catch (err) {
      console.error('getRevenueCurrentQuarter error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  getRevenueCurrentYear: async (req, res) => {
    try {
     
      const revenue = await order.getRevenueCurrentYear();
      return res.json({ revenue });
    } catch (err) {
      console.error('getRevenueCurrentYear error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

};

module.exports = OrderController;

