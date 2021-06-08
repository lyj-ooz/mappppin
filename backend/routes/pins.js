const router = require("express").Router();

const Pin = require("../models/Pin");

//create("POST") a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get("GET") all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find(); // find 'all'
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
