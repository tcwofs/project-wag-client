const express = require('express');
const router = express.Router();
// const path = require('path');

router.get('/', (req, res) => {
  res.send('server is up and running!');
});

// router.use(express.static(path.join(__dirname, '../build')));
// router.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

module.exports = router;
