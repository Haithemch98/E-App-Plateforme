const express = require("express");
const router = express.Router();
const authJwt = require("../auth/authMiddelware");
const multer = require('multer')

const upload = multer()

const {
  getAllClasses,
  getOneClass,
  addClass,
  updateClass,
  deleteClass,
  addUserToClass,
  acceptUserRequest,
  getAllPendingStudentClasses,
  getUserEnrolledClasses,
  getAllInactiveClasses,
  rejectUserRequest
} = require("../controllers/class");
const { addCourseToClass } = require("../controllers/course");

router.get("/getAll", getAllClasses);
router.get("/inactiveClasses", getAllInactiveClasses)
router.post("/", upload.single('image'), addClass);
router.post("/:classId/:userId", addUserToClass);
router.put("/:classId", upload.single('image'), updateClass);
router.delete("/:classId", deleteClass);
router.put("/accept/:classId/:userId", acceptUserRequest)
router.put("/reject/:classId/:userId", rejectUserRequest);
router.get("/getPendingStudentClasses", getAllPendingStudentClasses);
router.get("/userAcceptedClass", getUserEnrolledClasses)
router.get("/:classId", getOneClass);




module.exports = router;
