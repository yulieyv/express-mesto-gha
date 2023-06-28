const router = require("express").Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.post("/users", createUser);
router.patch("/users/me", updateUserInfo);
router.patch("/users/me/avatar", updateAvatar);

router.post("/", () => {
  console.log("Есть запрос!");
});

module.exports = router;
