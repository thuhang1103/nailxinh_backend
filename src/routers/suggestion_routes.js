const express = require('express');
const router = express.Router();
const Controller = require('../controllers/suggestionController');


router.get('/name', Controller.getSuggestionsByName);
router.post('/add', Controller.addSuggestion);
module.exports = router;