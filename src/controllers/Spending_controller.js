const pointModel = require('../models/points/pointModel');
const spendingModel = require('../models/pending_model');

const SpendingController = {
  
  // GET current month spending for authenticated user
  getCurrentMonthSpending: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const data = await spendingModel.getCurrentMonthSpending(userId);
      return res.json(data ?? { Year: null, Month: null, TotalSpending: 0 });
    } catch (err) {
      console.error('getCurrentMonthSpending error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  // GET monthly spending (array) for current year
  getMonthlySpendingCurrentYear: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const list = await spendingModel.getMonthlySpendingCurrentYear(userId);
      return res.json(Array.isArray(list) && list.length ? list : []);
    } catch (err) {
      console.error('getMonthlySpendingCurrentYear error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  // GET count of completed orders in current month
  countCompletedOrdersCurrentMonth: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const count = await spendingModel.countCompletedOrdersCurrentMonth(userId);
      return res.json({ CompletedOrderCount: Number(count ?? 0) });
    } catch (err) {
      console.error('countCompletedOrdersCurrentMonth error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  // GET sum of completed amount in current year
  sumCurrentYear: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const total = await spendingModel.sumCurrentYear(userId);
      return res.json({ TotalAmount: Number(total ?? 0) });
    } catch (err) {
      console.error('sumCurrentYear error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  // GET count of completed orders in current year
  countCompletedOrdersCurrentYear: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const count = await spendingModel.countCompletedOrdersCurrentYear(userId);
      return res.json({ CompletedOrderCount: Number(count ?? 0) });
    } catch (err) {
      console.error('countCompletedOrdersCurrentYear error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

};

module.exports = SpendingController;