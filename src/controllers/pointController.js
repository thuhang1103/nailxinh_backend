const pointModel = require('../models/points/pointModel');
const { randomReward } = require('../services/pointService');

const PointController = {
  getLoyaltyPoints: async (req, res) => {
    try {
      const userId = Number( req.user?.UserID );
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const data = await pointModel.getLoyaltyPointsByUserId(userId);
      if (!data) return res.status(404).json({ error: 'Customer not found' });
      return res.json(data);
    } catch (err) {
      console.error('getLoyaltyPoints error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  getMembershipLevel: async (req, res) => {
    try {
      const userId = Number( req.user?.UserID );
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const level = await pointModel.getMembershipLevelByUserId(userId);
      return res.json({ MembershipLevel: level });
    } catch (err) {
      console.error('getMembershipLevel error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  addPointsDaily: async (req, res) => {
    try {
      const userId = Number( req.user?.UserID );
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const affected = await pointModel.addDailyLoyaltyPoints(userId);
      if (affected === 0) return res.status(400).json({ error: 'Không thể cộng điểm (đã nhận hoặc customer không tồn tại)' });
      return res.json({ message: 'đã hết lượt hôm nay', affectedRows: affected });
    } catch (err) {
      console.error('addPointsDaily error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  getPointsStatus: async (req, res) => {
    try {
      const userId = Number( req.user?.UserID );
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const status = await pointModel.getCustomerPointsStatus(userId);
      if (!status) return res.status(404).json({ error: 'Customer not found' });
      return res.json(status);
    } catch (err) {
      console.error('getPointsStatus error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  //checkCanSpinToday
  checkCanSpinToday: async (req, res) => {
    try {
      const userId = Number( req.user?.UserID );
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const canSpin = await pointModel.checkCanSpinToday(userId);
      if (canSpin === null) return res.status(404).json({ error: 'Customer not found' });
      return res.json({ canSpin });
    } catch (err) {
      console.error('checkCanSpinToday error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  spinLucky: async (req, res) => {
    try {
      const userId = Number( req.user?.UserID );
      if (!userId) {
        return res.status(400).json({ error: 'userId required' });
      }

      // Random điểm
      const points = randomReward();

      // Thực hiện quay (transaction)
      await pointModel.spinLucky(userId, points);

      return res.json({
        success: true,
        pointsReceived: points
      });

    } catch (err) {
      if (err.message === 'ALREADY_SPUN') {
        return res.status(400).json({
          error: 'Hôm nay bạn đã quay rồi'
        });
      }

      console.error('spinLucky error:', err);
      return res.status(500).json({ error: 'Spin failed' });
    }
  },
  resetLoyaltyPoints: async (req, res) => {
    try {
      const userId = Number( req.user?.UserID );
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const affected = await pointModel.resetLoyaltyPointsByUserId(userId);
      if (affected === 0) return res.status(400).json({ error: 'Không thể reset điểm (customer không tồn tại)' });
      return res.json({ message: 'Đã reset điểm thành công', affectedRows: affected });
    } catch (err) {
      console.error('resetLoyaltyPoints error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

};

module.exports = PointController;