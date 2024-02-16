const sharp = require('sharp');

module.exports = {
  path: '/blur',
  info: 'Blur a image (pass image in body)',
  type: 'post',
  params: ['force', false],
  category: "image",

  async execute(req, res) {
    if (!req.body) {
      res.json({
        err: true,
        msg: 'You must pass a image in the request body'
      })
      return;
    }
    if (Number(req.query['force']) > 1000) {
      res.json({
        err: true,
        msg: 'Force too big'
      })
      return;
    }
    if (Number(req.query['force']) < 1) {
      res.json({
        err: true,
        msg: 'Force too small'
      })
      return;
    }
    sharp(req.body)
      .blur(Number(req.query['force']) || 8)
      .toBuffer()
      .then(outputBuffer => {
        res.json({
          image: 'data:image/png;base64,' + outputBuffer.toString('base64')
        })
      })
  }
}