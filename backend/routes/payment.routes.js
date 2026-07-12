const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/create-order", authUser, paymentController.createOrder);
router.post("/verify", authUser, paymentController.verifyPayment);
router.post("/cash", authUser, paymentController.processCashPayment);

module.exports = router;
