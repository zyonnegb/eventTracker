module.exports = function(app, passport, db) {
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('events').find().toArray((err, result) => {
          console.log(result)
          if (err) return console.log(err)
          res.render('profile.ejs', {
            events : result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

//Event Board CRUD
    //Post Method For New Event
    app.post('/event', (req, res) => {
      let month;
      if (req.body.month == '01' || req.body.month == '1') {
        month = 'January';
      } else if (req.body.month == '02' || req.body.month == '2') {
        month = 'February';
      } else if (req.body.month == '03' || req.body.month == '3') {
        month = 'March';
      } else if (req.body.month == '04' || req.body.month == '4') {
        month = 'April';
      } else if (req.body.month == '05' || req.body.month == '5') {
        month = 'May';
      } else if (req.body.month == '06' || req.body.month == '6') {
        month = 'June';
      } else if (req.body.month == '07' || req.body.month == '7') {
        month = 'July';
      } else if (req.body.month == '08' || req.body.month == '8') {
        month = 'August';
      } else if (req.body.month == '09' || req.body.month == '9') {
        month = 'September';
      } else if (req.body.month == '10') {
        month = 'October';
      } else if (req.body.month == '11') {
        month = 'November';
      } else if (req.body.month == '12') {
        month = 'December';
      }else{
        return
      }

      db.collection('events').save({yourName: req.body.yourName, eventName: req.body.eventName, eventDesc: req.body.eventDesc, month: month, day: req.body.day, year: req.body.year, }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })
    // Put Method To Add Star When Favorited
    app.put('/favorite', (req, res) => {
      db.collection('events')
      .findOneAndUpdate({eventName: req.body.eventName}, 
        {
        $set: {
          eventName: `★ - ${req.body.eventName}`
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })
    // Put Method To Remove Star, When Aleady Favorited
    app.put('/unfavorite', (req, res) => {
      db.collection('events')
      .findOneAndUpdate({eventName: `★ - ${req.body.eventName}`}, 
        {
        $set: {
          eventName: req.body.eventName
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })
    // Delete Method To Delete Event
    app.delete('/delete', (req, res) => {
      db.collection('events').findOneAndDelete({yourName: req.body.yourName, eventName: req.body.eventName, eventDesc: req.body.eventDesc}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
