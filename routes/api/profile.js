const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


// const validateProfileInput = require('../../validation/profile');
// const validateExperienceInput = require('../../validation/experience');


const Profile = require('../../models/Profile');

const User = require('../../models/User');

router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));


router.get(
  '/',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});



router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});



router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateProfileInput(req.body);

  
    // if (!isValid) {
      
    //   return res.status(400).json(errors);
    // }

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
   
   
   

   
    profileFields.social = {};
   
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
    
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);


router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateExperienceInput(req.body);

    // if (!isValid) {
    
    //   return res.status(400).json(errors);
    // }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

   
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);





router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
      
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

     
        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);


router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
      
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

     
        profile.education.splice(removeIndex, 1);

       
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);


router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
