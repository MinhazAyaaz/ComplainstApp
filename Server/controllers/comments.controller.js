const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Tutorial = db.tutorials;
const Comments = db.comments;
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
  
  
  // Save User to Database
  User.create({
    nsuid: req.body.nsuid,
    email: req.body.email,
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
            to: req.body.email,
            subject: "Confirm Email",
            html: `Please click this email to confirm your email: <a target="_blank" href="${url}">${url}</a>`,
        })
        
       }catch(e){
        res.status(808).send()
       }

       //Assign role to the user while signing up
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        // set as default role
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
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
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(504).send({ message: err.message });
    });
};

//HANDLES LOGIN FORM FUCNTIONS 
exports.login = (req, res) => {

  //Look for an account with the ID
  User.findOne({
    where: {
      nsuid: req.body.nsuid
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
          roles: authorities,
          verified: user.verified,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(503).send({ message: "Error" });
    });
};

//Creates comment
exports.createComment = async (req, res) => {
    
  let checkUser = await Tutorial.findOne({
    where: {
      reviewer: req.userId,
      complaintid: req.body.complaintid,status:0
    }
  });
  
  let checkUser2 = await User.findOne({
    where: {
      nsuid: req.userId,
      [Op.or]: [{role: '2'},{role:'3'}],status:0
    }
  });

  if(checkUser == null){
    return res.status(431)
  }
  if(checkUser2 == null){
    return res.status(432)
  }
  if (!req.body.comment) {
    return res.status(781)
  }
  let commentid=req.body.comment;
    let commentlength=commentid.length;
    
    if((commentlength>1000))
    {
      return res.sendStatus(782)
    } 

    //LABIB comment histroy
let complaintby = await User.findOne({
  where: {
    nsuid: req.body.createdby,
   
  }
});
  let complaintAgainst = await User.findOne({
    where: {
      nsuid: req.body.against,
     
    }
  });
  // Save User to Database
  Comments.create({
    comment: req.body.comment,
    user: req.userId,
    complaintComplaintid: req.body.complaintid
  })
  .then(data => {

    transporter.sendMail({
      from: "nsucomplaints.noreply@gmail.com",
      to: complaintby.email,
      subject: "You have a new comment on your complaint",
      html: `<p>Your complaint reviewer (${checkUser2.name},${checkUser2.nsuid}) has left a comment on your complaint : </p>
      <h2>${ req.body.comment}</h2>
      <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
      `,
    })
    

    
  })
  .then(data => {

    transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: complaintAgainst.email,
    subject: "A comment has been made on a complaint made against you.",
    html: `<p>The reviewer (${checkUser2.name},${checkUser2.nsuid}) of a complaint made by (${complaintby.name},${complaintby.nsuid}) against you,
     has left a comment: </p>
    <h2>${ req.body.comment}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
})
  .catch(err => {
    res.status(511).send({ message: err.message });
  });
  
  };

 exports.fetchComments = (req, res) => {
    
    let complaintid= req.query.complaintid;
    Comments.findAll({where: { complaintComplaintid: complaintid}, order: [ ['updatedAt','DESC'] ]})
  
    .then(data => {
      res.send(data);
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          `Cannot get comment with id=${complaintid} and against =${against}. `
      });
    });
};

exports.fetchCommentCount = (req, res) => {
    
    
    let complaintid= req.query.complaintid;
    Comments.findAll({where: { complaintComplaintid: complaintid}, order: [ ['updatedAt','DESC'] ]})
  
    .then(data => {
      res.send(data);
      
    })
    .catch(err => {
      res.status(599).send({
        message:
          `Cannot get comment with id=${complaintid} and against =${against}. `
      });
    });
};



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
        res.status(509).send({
          message:
            err.message || "Some error occurred while retrieving reviewers."
        });
      });
  };
 
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