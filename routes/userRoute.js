const router = require("express").Router();
const userCtrl = require("../controller/userCtrl");

router.post("/setRecord", userCtrl.setRecord);
router.post("/getRecord", userCtrl.getRecord);

module.exports = router;
