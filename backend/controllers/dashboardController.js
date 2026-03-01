// controllers/dashboardController.js
const dashboardController = (req, res) => {
  const { id, email, username } = req.user || {};

  return res.status(200).json({
    message: `Welcome to your dashboard, ${username || email}`,
    user: { id, email, username },
  });
};

module.exports = dashboardController;

