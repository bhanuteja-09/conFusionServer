var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({}, function (err, user) {
    if (err) throw err;
    res.json(user);
});

  // res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
      user.firstname = req.body.firstname;
      if (req.body.lastname)
      user.lastname = req.body.lastname;
      user.save((err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
        return ;
      }
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    });  
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  if (err) {
    return next(err);
  }
  if (!user) {
    return res.status(401).json({
      err: info
    });
  }
  req.logIn(user, function(err) {
    if (err) {
      return res.status(500).json({
        err: 'Could not log in user'
      });
    }

    var token = Verify.getToken(user);
            res.status(200).json({
      status: 'Login successful!',
      success: true,
      token: token
    });
  })(req,res,next);
});
  
  // var token = authenticate.getToken({_id: req.user._id});
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'application/json');
  // res.json({success: true, token: token, status: 'You are successfully logged in!'});
// });

router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });

  // if (req.session) {
  //   req.session.destroy();
  //   res.clearCookie('session-id');
  //   res.redirect('/');
  // }
  // else {
  //   var err = new Error('You are not logged in!');
  //   err.status = 403;
  //   next(err);
  // }
});

module.exports = router;
