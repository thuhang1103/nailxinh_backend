const AddressModel = require('../models/address/address_model');

const AddressController = {
  // GET /api/address/default
  getDefaultAddress: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ error: 'userId required' });
      }

      const address = await AddressModel.getDefaultAddressByUserId(userId);
      if (!address) return res.status(404).json({ error: 'Default address not found' });
      return res.json(address);
    } catch (err) {
      console.error('getDefaultAddress error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  // POST /api/address
  addShippingAddress: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ error: 'userId required' });
      }

      const {
        ProvinceCode = null,
        DistrictCode = null,
        WardCode = null,
        RecipientName = null,
        Phone = null,
        Province = null,
        District = null,
        Ward = null,
        StreetAddress = null
      } = req.body || {};

      const ok = await AddressModel.addShippingAddressByUserId(userId, {
        ProvinceCode,
        DistrictCode,
        WardCode,
        RecipientName,
        Phone,
        Province,
        District,
        Ward,
        StreetAddress
      });

      if (!ok) return res.status(400).json({ error: 'Add address failed' });
      return res.status(201).json({ message: 'Address added' });
    } catch (err) {
      console.error('addShippingAddress error:', err);
      if (typeof err.message === 'string' && err.message.includes('Customer not found')) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  },

  // GET /api/address
  getShippingAddresses: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ error: 'userId required' });
      }

      const list = await AddressModel.getShippingAddressesByUserId(userId);
      return res.json(list);
    } catch (err) {
      console.error('getShippingAddresses error:', err);
      if (typeof err.message === 'string' && err.message.includes('Customer not found')) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  },

  // DELETE /api/address/:addressId
  deleteShippingAddress: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);
      const { addressId } = req.body;

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ error: 'userId required' });
      }
      if (!Number.isInteger(addressId) || addressId <= 0) {
        return res.status(400).json({ error: 'addressId required' });
      }

      const ok = await AddressModel.deleteShippingAddressByUserId(userId, addressId);
      if (!ok) return res.status(400).json({ error: 'Delete address failed or not allowed' });
      return res.json({ message: 'Address deleted' });
    } catch (err) {
      console.error('getPointsStatus error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  

  // PUT /api/address/:addressId
  updateShippingAddress: async (req, res) => {
    try {
      const userId = Number(req.user?.UserID);

      
      const {
        addressId,
        ProvinceCode = null,
        DistrictCode = null,
        WardCode = null,
        RecipientName = null,
        Phone = null,
        Province = null,
        District = null,
        Ward = null,
        StreetAddress = null
      } = req.body || {};

      const addrIdNum = Number(addressId);

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ error: 'userId required' });
      }
      if (!Number.isInteger(addrIdNum) || addrIdNum <= 0) {
        return res.status(400).json({ error: 'addressId required' });
      }

     const ok = await AddressModel.updateShippingAddressByUserId(userId, {
        addressId: addrIdNum,
        ProvinceCode,
        DistrictCode,
        WardCode,
        RecipientName,
        Phone,
        Province,
        District,
        Ward,
        StreetAddress
      });

      if (!ok) return res.status(400).json({ error: 'Update address failed' });
      return res.json({ message: 'Address updated' });
    } catch (err) {
      console.error('updateShippingAddress error:', err);
      if (typeof err.message === 'string' && err.message.includes('Customer not found')) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      if (typeof err.message === 'string' && err.message.includes('Address not found')) {
        return res.status(404).json({ error: 'Address not found or does not belong to this user' });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = AddressController;