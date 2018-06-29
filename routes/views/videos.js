var keystone = require('keystone')

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res)
    var locals = res.locals
    // set locals
    locals.section = 'video'

    // load videos 
    view.query('video', keystone.list('Video').model.find())

    view.render('videos')
}