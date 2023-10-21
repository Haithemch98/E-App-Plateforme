const { Class, User, StudentClasses, sequelize } = require("../Database");
const { Op } = require("sequelize");
const cloudinary = require('../utils/cloudinary')
const { Readable } = require('stream')

module.exports = {
  getAllClasses: async (req, res) => {
    try {
      const classRooms = await Class.findAll();
      res.status(200).json(classRooms);
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },
  getAllInactiveClasses: async (req, res) => {
    const userId = req.userId
    try {
      const classRooms = await Class.findAll({
        where: sequelize.literal(`
        id NOT IN (
          SELECT classId
          FROM StudentClasses
          WHERE studentId = ${userId}
        )
      `),
      });
      res.status(200).json(classRooms);
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },
  getCartItems: async (req, res) => {
    const { id } = req.params
    try {
      const result = await Product.findAll({
        include: {
          model: User,
          where: { id: id },
        },
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },
  getOneClass: async (req, res) => {
    const classId = req.params.classId;
    try {
      const classRoom = await Class.findOne({
        where: {
          id: classId,
        },
      });
      if (classRoom) {
        res.status(200).json(classRoom);
      } else {
        res.status(404).send("Class doesn't exist");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },
  addClass: async (req, res) => {
    try {
      const { name } = req.body;
      const imageBuffer = req.file.buffer;
      const imageStream = Readable.from(imageBuffer)
      const cloudinaryResult = await cloudinary.uploader.upload_stream({
        resource_type: 'image',
      },
        async (error, result) => {
          if (error) {
            console.error("error uploading image to cloudinary ", error);
            res.status(500).json({ error: "image upload failed" });
          }
          console.log(cloudinaryResult)

          const classRoom = await Class.create({ name, image: result.secure_url })
          res.status(201).json(classRoom)
        }
      )
      imageStream.pipe(cloudinaryResult)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },
  updateClass: async (req, res) => {
    try {
      const classId = req.params.classId;
      const { name } = req.body;
      if (req.file) {
        const imageBuffer = req.file.buffer;
        const imageStream = Readable.from(imageBuffer)
        const cloudinaryResult = await cloudinary.uploader.upload_stream({
          resource_type: 'image',
        },
          async (error, result) => {
            if (error) {
              console.error('Error uploading image to Cloudinary:', error);
              res.status(500).json({ error: 'Image upload failed' });
            }
            console.log(cloudinaryResult)

            const updatedClass = await Class.update({ name, image: result.secure_url }, {
              where: {
                id: classId,
              },
            }
            );
            res.status(201).json(updatedClass);
          }
        )
        imageStream.pipe(cloudinaryResult);
      }

      else {
        const updatedClass = await Class.update({ name }, {
          where: {
            id: classId,
          },
        }
        );
        res.status(201).json(updatedClass);

      }

    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },
  deleteClass: async (req, res) => {
    const classId = req.params.classId;
    try {
      await Class.destroy({
        where: {
          id: classId,
        },
      });
      res.status(204).send("Class deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },
  addUserToClass: async (req, res) => {
    const classId = req.params.classId;
    const userId = req.userId

    try {
      const classRoom = await Class.findByPk(classId);
      if (!classRoom) {
        console.log("owwwww problem with classRoom")
        return res.status(404).send('Class not found');
      }
      const user = await User.findByPk(userId);
      if (!user) {
        console.log("owwwwwwww problem user")
        return res.status(404).send('User not found');
      }

      await classRoom.addUser(user, { status: 'pending' });
      res.status(201).send('User request to join the class is pending');
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },

  acceptUserRequest: async (req, res) => {
    const classId = req.params.classId;
    const userId = req.params.userId;

    try {
      const classRoom = await Class.findByPk(classId);
      if (!classRoom) {
        return res.status(404).send("Class not found");
      }
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      await StudentClasses.update({ status: "accepted" }, {
        where: {
          classId: classId,
          studentId: userId
        }
      });
      res.status(200).send("User's request has been accepted");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },

  //for accepted users  
  getUserEnrolledClasses: async (req, res) => {
    const userId = req.userId

    try {

      const enrolledClasses = await StudentClasses.findAll({
        where: {
          studentId: userId,
          status: 'accepted',
        },
      });

      const classIds = enrolledClasses.map((enrollment) => enrollment.classId);

      const enrolledClassDetails = await Class.findAll({
        where: {
          id: classIds,
        },
      });

      res.status(200).json(enrolledClassDetails);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },

  rejectUserRequest: async (req, res) => {
    const classId = req.params.classId;
    const userId = req.params.userId;

    try {
      const classRoom = await Class.findByPk(classId);
      if (!classRoom) {
        return res.status(404).send("Class not found");
      }
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      await StudentClasses.destroy({
        where: {
          classId: classId,
          studentId: userId
        }
      });
      await classRoom.update({ status: "inactive" })
      res.status(200).send("User's request has been rejected");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },

  getAllPendingStudentClasses: async (req, res) => {
    console.log("accesssssssssssssssssssssssssssssss")
    try {
      const pendingStudentClasses = await StudentClasses.findAll({
        where: {
          status: 'pending'
        }
      });
      res.status(200).json(pendingStudentClasses);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred: " + error.message);
    }
  },

};
