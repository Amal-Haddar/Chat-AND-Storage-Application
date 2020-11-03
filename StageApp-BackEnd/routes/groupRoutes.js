const express = require("express");
const router = express.Router();

const GroupCtrl = require("../controllers/groups");
const AuthHelper = require("../Helpers/AuthHelper");

router.get("/groups", AuthHelper.VerifyToken, GroupCtrl.GetAllGroups);
router.get("/group/:id", AuthHelper.VerifyToken, GroupCtrl.GetGroup);

router.post("/group/add-group", AuthHelper.VerifyToken, GroupCtrl.AddGroup);

router.put("/group/edit-group",AuthHelper.VerifyToken, GroupCtrl.EditGroup);

router.delete("/group/delete-group/:id",AuthHelper.VerifyToken, GroupCtrl.DeleteGroup)


module.exports = router;