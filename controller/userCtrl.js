const Users = require("../model/userModel");
const amqp = require("amqplib/callback_api");
const userCtrl = {
  setRecord: async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = await Users.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "Email already exists" });
      }
      const newUser = new Users({ name, email });

      await newUser.save();
      const ruser = await Users.findOne({ email });

      amqp.connect("amqp://localhost", (err, connection) => {
        if (err) {
          throw err;
        }
        connection.createChannel((err, channel) => {
          if (err) {
            throw err;
          }
          let queueName = "technical";
          let message = ruser.id;
          channel.assertQueue(queueName, { durable: false });
          channel.sendToQueue(queueName, Buffer.from(message));
          console.log(`Message : ${message}`);
          setTimeout(() => {
            connection.close();
          }, 1000);
        });
      });

      res.json({ id: ruser.id });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getRecord: async (req, res) => {
    try {
      const { id } = req.body;
      const user = await Users.findById(id);
      res.json({ name: user.name, email: user.email });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
