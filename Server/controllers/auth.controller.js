const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
// const fileUpload = require('express-fileupload');

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('689285763404-9ih3lrpb9154mhob4rs8oqbpruvng95s.apps.googleusercontent.com');

//Used to encode and decode JWT for email confirmation link
//Should probably get this to be an environmental variable
const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';

//Configuration of email host (the account emails are sent from)
const transporter = nodemailer.createTransport( {
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: "nsucomplaints.noreply@gmail.com",
    pass: "NSUcomplaints#123456789",
    clientId: '189085341403-6jkd13am7e6r6e75os36vmh2g4phunqi.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04lzli9cFEJCLCgYIARAAGAQSNwF-L9Irw0fuFkQuuVT570nUQp5m5oCZRGYMq7Jdm2c97vuiUYlbPUh7g4MNrk8pgijaI8kOvfc',
  },
  tls: {
    rejectUnauthorized: false
}
});


//HANDLES ALL SIGN UP FORM RELATED WORK
exports.signup = (req, res) => {

  //Email sanitation to ensure correct domain
  var email = req.body.email
  
  //non-staff people are given @northsouth.edu domain
  if(req.body.role === "1" || req.body.role === "2" || req.body.role === "3" ){
    email = email.split('@')[0]
    email = email + "@northsouth.edu"
  }

  // Save User to Database
  User.create({
    nsuid: req.body.nsuid,
    email: email,
    password: bcrypt.hashSync(req.body.password, 8),
    name:req.body.name,
    verified: req.body.verified ? req.body.verified : "false",
    status:"activated",
    photo:"n/a",
    idscan:"n/a",
    role: req.body.role
  })
    .then(user => {

      try{
        //generates confirmation email link
        emailToken = jwt.sign( {user: req.body.nsuid}, EMAIL_SECRET )
        const url = `http://localhost:5000/confirmation/${emailToken}`
  
          //confirmation email configuration
          transporter.sendMail({
            from: "nsucomplaints.noreply@gmail.com",
            to: email,
            subject: "Confirm Email",
            html: `Please click this email to confirm your email: <a target="_blank" href="${url}">${url}</a>`,
        })
        
       }catch(e){
        res.status(808).send()
       }

      
    })
    .catch(err => {
      res.status(501).send({ message: err.message });
    });
};


//HANDLES ALL GOOGLE RELATED AUTH
exports.GoogleSignup = async (req, res) => {
  
  const { token } = req.body;

  //Fetched idToken is used to verify the user using Google's API
  //hd: northsouth.edu is used to restrict domain to northsouth university
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience:'689285763404-9ih3lrpb9154mhob4rs8oqbpruvng95s.apps.googleusercontent.com',
    hd: "northsouth.edu"
  });

  
  let family_name = ticket.payload.family_name; //nsu id
  let given_name = ticket.payload.given_name; //user name
  let email = ticket.payload.email;
  let picture = ticket.payload.picture;
  // return res.send({
  //   id: family_name,
  //   name: given_name,
  //   email: email,
  //   picture: picture
  // })
  // const { family_name, given_name, email, picture } = ticket.getPayload();
  

  //Check if Google account user already exists in database
  let checkUser = await User.findOne({
    where: {
      nsuid: family_name,
      status:"activated"
    }
  });
  if(checkUser){
    //if they exist, just return a verification token
    var authToken = jwt.sign({ id: family_name }, config.secret, {
      expiresIn: 86400 // 24 hours
    });
        res.status(200).send({
          id: checkUser.id,
          nsuid: checkUser.nsuid,
          email: checkUser.email,
          verified: checkUser.verified,
          accessToken: authToken,
          role: checkUser.role,
          status:"disabled"
        });
      ;

    return res.send(999);
  }

  //else create a new user in the database with Google information

  User.create({
    nsuid: family_name,
    email: email,
    password: "",
    name: given_name,
    verified: req.body.verified ? req.body.verified : "false",
    status:"activated",
    photo: picture,
    idscan:"n/a"
    
  })
    .then(user => {
      //then send back a verification token
      var authToken2 = jwt.sign({ id: user.nsuid }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        nsuid: user.nsuid,
        email: user.email,
        verified: user.verified,
        accessToken: authToken2
      });

      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            //this probably needs to be removed !important
            var authToken2 = jwt.sign({ id: user.nsuid }, config.secret, {
              expiresIn: 86400 // 24 hours
            });
            res.status(200).send({
              nsuid: user.nsuid,
              email: user.email,
              roles: authorities,
              verified: user.verified,
              accessToken: authToken2
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          // res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(504).send({ message: err.message });
    });
};
// Google login through the mobile
exports.GoogleSignupMobile = async (req, res) => {
  
  const { token } = req.body;

  //Fetched idToken is used to verify the user using Google's API
  //hd: northsouth.edu is used to restrict domain to northsouth university
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience:'689285763404-9ih3lrpb9154mhob4rs8oqbpruvng95s.apps.googleusercontent.com',
    hd: "northsouth.edu"
  });

  
  let family_name = ticket.payload.family_name; //nsu id
  let given_name = ticket.payload.given_name; //user name
  let email = ticket.payload.email;
  let picture = ticket.payload.picture;
  // return res.send({
  //   id: family_name,
  //   name: given_name,
  //   email: email,
  //   picture: picture
  // })
  // const { family_name, given_name, email, picture } = ticket.getPayload();
  

  //Check if Google account user already exists in database
  let checkUser = await User.findOne({
    where: {
      nsuid: family_name
    }
  });
  if(checkUser){
    //if they exist, just return a verification token
    var authToken = jwt.sign({ id: family_name }, config.secret, {
      expiresIn: 86400 // 24 hours
    });
        res.status(200).send({
          id: checkUser.id,
          nsuid: checkUser.nsuid,
          email: checkUser.email,
          verified: checkUser.verified,
          accessToken: authToken
        });
      ;

    return res.send(999);
  }
  else{
    res.send({ message: "User was registered successfully!" });
  }

  
};

//HANDLES LOGIN FORM FUCNTIONS 
exports.login = (req, res) => {

  //Look for an account with the ID
  User.findOne({
    where: {
      nsuid: req.body.nsuid,status:"activated"
   
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      
      if(user.verified == "false"){
        return res.status(512).send({
          accessToken: null,
          message: "User Not Verified!"
        });
      }

      var token = jwt.sign({ id: user.nsuid }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          nsuid: user.nsuid,
          email: user.email,
          role: user.role,
          verified: user.verified,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(503).send({ message: "Error" });
    });
};
//finding the user logged in 
exports.findUser = (req, res) => {
    
  
  User.findOne({
    where: {
      nsuid: req.userId
    }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(502).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};
//finding list of all users except the user logged in 
exports.findOtherUser = (req, res) => {
    
  
  User.findOne({
    where: {
      nsuid: req.query.id
    }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(502).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};
//find all users 
exports.findAll = (req, res) => {
    
  
    User.findAll({attributes: ['name', 'nsuid']})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(502).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  };
  ////finding list of users to complaint against 
exports.findUserToComplainAgainst = (req, res) => {
  

  User.findAll({
    attributes: ['name', 'nsuid'],
    where: {
      nsuid: {
        [Op.ne]: req.userId
      }
    }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(509).send({
        message:
          err.message || "Some error occurred while retrieving reviewers."
      });
    });
};
//finding the reviewer that is eligible to review a comp
exports.findReviewerToReview = (req, res) => {
  

    User.findAll({
      attributes: ['name', 'nsuid'],
      where: {
        [Op.or]: [{role: '2'},{role:'3'}], nsuid: {
          [Op.ne]: req.query.id
        }
      }})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(534).send({
          message:
            err.message || "Some error occurred while retrieving reviewers."
        });
      });
};
//find all reviewers 
exports.findReviewers = (req, res) => {
  

  User.findAll({
    attributes: ['name', 'nsuid'],
    where: {
      [Op.or]: [{role: '2'},{role:'3'}]
    }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(534).send({
        message:
          err.message || "Some error occurred while retrieving reviewers."
      });
    });
};
//find a reviewer to to review
exports.findReviewerOne = (req, res) => {
  

  User.findOne({
    attributes: ['name', 'nsuid'],
    where: {
      [Op.or]: [{role: '2'},{role:'3'}],
      nsuid: req.query.id
    }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(534).send({
        message:
          err.message || "Some error occurred while retrieving reviewers."
      });
    });
};
//finding a list of all users with their statuses 
  exports.findUserWithStatus = (req, res) => {
    
  
    User.findAll({
      attributes: ['name', 'nsuid','status'],
      where: {
        nsuid: {
          [Op.ne]: req.userId
        }
      }})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(537).send({
          message:
            err.message || "Some error occurred while retrieving reviewers."
        });
      });
  };
  //disables account
  exports.updatedeactiavtionstatus = async (req, res) => {
    
    let checkUser2 = await User.findOne({
      where: {
        nsuid: req.userId,
        role: '5'// checks if the user is the admin
      }
    });
    if(checkUser2 == null){
      return res.status(4980)
    }
  
    User.update({
      status: "disabled"
     }, {
      where: { 
        nsuid: req.body.nsuid
       }
     })
     .then(data => {
      
        res.send({ message: "Account deactivation successfully!" });
     
    })
    .catch(err => {
      res.status(578).send({
        message:
          err.message || "Some error in deactivation."
      });
    }); 

  
 /*  try {
     User.update({status: "deactivated"}, {where: {nsuid:'0123456789'}})
    .then(() => {
      res.send({ message: "Account deactivation successfully!" });
    });
    
    
  } catch (e) {
    res.send('error in deactivation');
  } */


    //User.findAll({
     
     /*  where: {
        nsuid: {
          [Op.eq]: req.body.nsuid
        }
      }})
      .then(data => {
        User.update({status: "deactivated"}, {where: {nsuid:req.body.nsuid}})
        .then(() => {
          res.send({ message: "Account deactivation successfully!" });
        });
      })
      .catch(err => {
        res.status(509).send({
          message:
            err.message || "Some error in deactivation."
        });
      }); */

    
   /*  try {
       User.update({status: "deactivated"}, {where: {nsuid:'0123456789'}})
      .then(() => {
        res.send({ message: "Account deactivation successfully!" });
      });
      
      
    } catch (e) {
      res.send('error in deactivation');
    } */
  };
  
 
 //checks if the id is uploaded
  exports.findID = async (req, res) => {
    
  
    let checkUser = await User.findOne({
      where: {
        nsuid: req.userId
      }
    });
    if(checkUser.idscan == "n/a")
      res.send({findID : false})
    else
      res.send({findID : true})
  };
//finds the role of the user logged in 
  exports.findRole = async (req, res) => {
    
  
    let checkUser = await User.findOne({
      where: {
        nsuid: req.userId
      }
    });
    if(checkUser.role == null)
      res.send({findRole : false})
    else
      res.send({findRole : true})
  };
//not used 
exports.update = (req, res) => {
  try {
    jwt.verify(req.params.token, EMAIL_SECRET, (err, user)=>{
      let nsuid = user.user
      // await models.User.update({ confirmed: true }, { where: { id } });
      // let sql = 'UPDATE user SET verified=\'true\' WHERE nsuid=\''+ nsuid+'\';'
      
      User.update({verified: "true"}, {where: {nsuid: nsuid}})
    });
    
    
  } catch (e) {
    res.send('error');
  }

  return res.redirect('http://localhost:3000/login');
  };
//NOT USED
exports.uploadId = (req, res) => {
  if(req.files === null){
    return res.status(423)
  }
  nsuid = req.userId;
  const file = req.files.file

  file.mv(`${__dirname}/upload/${nsuid}.jpg`), (err)=>{
    if(err){
      res.status(523)
    }
  }
  let filePath = `${__dirname}/upload/${nsuid}.jpg`
  User.update({idscan: filePath }, {where: {nsuid: nsuid}})

  res.send(600)
  };
//updates the photo and idscan 
  exports.updatetest = (req, res) => {
    User.update({
      idscan: req.body.idscan,
      photo:req.body.idscan
     }, {
      where: { nsuid: req.userId  }
     })
     .then(data => {
      
      res.send({message:`sent succesfully to ${req.userId}`})  
      
     
    })
    .catch(err => {
      res.status(579).send({
        message:
          err.message || "Some error in deactivation."
      });
    })
   
    };
//updates status NOT USED
    exports.updateStatus = (req, res) => {
      User.update({
        role: req.body.role
       }, {
        where: { nsuid: req.userId  }
       })
       .then(data => {
        
        res.send({message:`sent succesfully to ${req.userId}`})  
        
       
      })
      .catch(err => {
        res.status(579).send({
          message:
            err.message || "Some error in deactivation."
        });
      })
     
      };
//updates the profile picture
    exports.setprofilepic = (req, res) => {
      User.update({
        photo: req.body.photo
       }, {
        where: { nsuid: req.userId  }
       })
       .then(data => {
        
        res.send({message:`sent succesfully to ${req.userId}`})  
        
       
      })
      .catch(err => {
        res.status(567).send({
          message:
            err.message || "Some error in prof pic upload."
        });
      })
     
      };