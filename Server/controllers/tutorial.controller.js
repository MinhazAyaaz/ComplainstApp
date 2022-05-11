const db = require("../models");
const Tutorial = db.tutorials;
const ComplaintHistory = db.complaintHistory;
const Op = db.Sequelize.Op;
const User = db.user;
const nodemailer = require('nodemailer');
// const fileUpload = require('express-fileupload');

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('689285763404-9ih3lrpb9154mhob4rs8oqbpruvng95s.apps.googleusercontent.com');

const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';
//configuring node mailer for email verification
const transporter = nodemailer.createTransport( {
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: "nsucomplaints.noreply@gmail.com",
    pass: "NSUcomplaints#123456789",
    clientId: '189085341403-6jkd13am7e6r6e75os36vmh2g4phunqi.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04HZNPXCsLV-JCgYIARAAGAQSNwF-L9Irfcj81DWrEfNM96rRMb9_l00DAmZzVl8NSJYYRQlxyk0t8GMUiBz2VxpzDqsfCwR-sOk',
  },
  tls: {
    rejectUnauthorized: false
}
});


// Create and Save a new complaint
exports.create = async (req, res) => {
  // Validate request
  
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"//checks for empty title
    });
    return;
    
  }

  else if (!req.body.body) {
    res.status(456).send({
      message: "Body can not be empty!"//checks for empty body
    });
    return;
  }
  else if (!req.body.reviewer) {
    res.status(405).send({
      message: "Reviewer can not be empty!"//checks for empty reviewer field
    });
    return;
  }
  else if (req.body.against==null) {
    res.status(406).send({
      message: "Against can not be empty!"//checks for empty against field 
    });
    return;
  }
  else if (!req.body.category) {
    res.status(407).send({
      message: "Category can not be empty!"//checks for empty catgory field
    });
    return;
  }
  



  // Create a complaint
  const tutorial = {
    title: req.body.title,
    against: req.body.against,
    body: req.body.body,
    reviewer: req.body.reviewer,
    category: req.body.category,
    createdby: req.userId,
    status: req.body.status ? req.body.status : false,
    evidence:req.body.evidence,
  };
//finds the user who is the creator of the compliant
  let creator = await User.findOne({
    where: {
      nsuid: req.userId
    }
  });
  //find the user who the comp is against
  let agaisnt = await User.findOne({
    where: {
      nsuid: req.body.against
    }
  });
  let reviewer = await User.findOne({
    where: {
      nsuid: req.body.reviewer
    }
  });

  var id;
 
  // Save comp in the database
  Tutorial.create(tutorial)
  
    .then(data => {
      // res.send(data);
      id = data.complaintid;
      console.log(parseFloat(id).toFixed(2));
      //complaintversions table gets updated
      const update = {
        complaintVersion: parseFloat(id).toFixed(2),
        title: req.body.title,
        date:req.body.date,
        against: req.body.against,
        body: req.body.body,
        reviewer: req.body.reviewer,
        category: req.body.category,
        createdby: req.userId,
        status: req.body.status ? req.body.status : false,
        evidence:req.body.evidence,
        complaintComplaintid: parseInt(id)
    
      };
      
//creating the update in complaints history table
      ComplaintHistory.create(update)
  
        res.send({
          message:
            "Something."
        });
    })
   
    .catch(err => {
      res.status(513).send({
        message:
          "Some error occurred while creating the complaint."
      });
    });
// emailing for any edits 
  transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: creator.email,
    subject: "Your complaint has been lodged.",
    html: `<p>A complaint has been filed by you: ${creator.name}, (${creator.nsuid})</p>
    <h2> Complaint: ${req.body.title}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
  transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: agaisnt.email,
    subject: "A complaint has been made agaisnt you.",
    html: `<p>A complaint has been filed agaisnt you by: ${creator.name}, (${creator.nsuid})</p>
    <h2> Complaint: ${req.body.title}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
  transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: reviewer.email,
    subject: "You are asked to review a complaint",
    html: `<p>You are asked to review a complaint by: ${creator.name}, (${creator.nsuid})</p>
    <h2> Complaint: ${req.body.title}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
};

//Create complaint by admin on others behalf

exports.create2 = async (req, res) => {
  // Validate request
  
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"//checks for empty title
    });
    return;
    
  }

  else if (!req.body.body) {
    res.status(456).send({
      message: "Body can not be empty!"//checks for empty body
    });
    return;
  }
  else if (!req.body.reviewer) {
    res.status(405).send({
      message: "Reviewer can not be empty!"//checks for empty reviewer
    });
    return;
  }
  else if (req.body.against==null) {
    res.status(406).send({
      message: "Against can not be empty!"//checks for empty against
    });
    return;
  }
  else if (!req.body.category) {
    res.status(407).send({
      message: "Category can not be empty!"////checks for empty category
    });
    return;
  }
  



  // Create a complaint
  const tutorial = {
    title: req.body.title,
    against: req.body.against,
    body: req.body.body,
    reviewer: req.body.reviewer,
    category: req.body.category,
    createdby: req.body.createdby,
    evidence:req.body.evidence,
    status: req.body.status ? req.body.status : false

  };
 //find the user who the comp is created by
  let creator = await User.findOne({
    where: {
      nsuid: req.userId
    }
  });
   //find the user who the comp is against
  let agaisnt = await User.findOne({
    where: {
      nsuid: req.body.against
    }
  });
  let reviewer = await User.findOne({
    where: {
      nsuid: req.body.reviewer
    }
  });

  // Save complaint in the database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(596).send({
        message:
          "Some error occurred while creating the complaint."
      });
    });
//activate emailing for the creation of complaints 
  transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: creator.email,
    subject: "Your complaint has been lodged.",
    html: `<p>A complaint has been filed by you: ${creator.name}, (${creator.nsuid})</p>
    <h2> Complaint: ${req.body.title}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
  transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: agaisnt.email,
    subject: "A complaint has been made agaisnt you.",
    html: `<p>A complaint has been filed agaisnt you by: ${creator.name}, (${creator.nsuid})</p>
    <h2> Complaint: ${req.body.title}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
  transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: reviewer.email,
    subject: "You are asked to review a complaint",
    html: `<p>You are asked to review a complaint by: ${creator.name}, (${creator.nsuid})</p>
    <h2> Complaint: ${req.body.title}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
};








// Retrieve all complaints received from the database.
exports.findAll = (req, res) => {
  //res.json(req);
 //RECEIVED!!!!
 const complaintid= req.userId;
  Tutorial.findAll({where: { against: complaintid}, order: [ ['updatedAt','DESC'] ]})
  
    .then(data => {
      res.send(data);
      
    })
    .catch(err => {
      res.status(593).send({
        message:
          `Cannot get comp with id=${complaintid} and against =${against}. `
      });
    });
};

// find all complaints filed by the user
exports.findAll2 = (req, res) => {
  //res.json(req);
 //const against=req.userId.userId;
 const complaintid= req.userId;
  Tutorial.findAll({where: {createdby: complaintid}, order: [ ['updatedAt','DESC'] ]})
  
    .then(data => {
      res.send(data);
      
    })
    .catch(err => {
      res.status(593).send({
        message:
          `Cannot get comp with id=${complaintid} and against =${against}. `
      });
    });
};
//find all complaints in the db 
exports.findAll4 = async (req, res) => {
   let checkUser2 = await User.findOne({
    where: {
      nsuid: req.userId,
      role: '5'// checks the user has admin role
    }
  }) 

  if(checkUser2 == null){
    return res.status(5981)
  } 

  //res.json(req);
 //const against=req.userId.userId;
 const complaintid= req.userId;

  Tutorial.findAll()// then finds all the comps
  
  .then(data => {
    res.send(data);
   
    
  })
  .catch(err => {
    res.status(5980).send({
      message:
        `Cannot get comp with id=${complaintid} and against =${against}. `
    });
  });


 
};

// find all comps to review 
exports.findAll3 = (req, res) => {
  //res.json(req);
 //const against=req.userId.userId;
 const complaintid= req.userId;
  Tutorial.findAll({where: {reviewer: complaintid}, order: [ ['updatedAt','DESC'] ]})
  
    .then(data => {
      res.send(data);
      
    })
    .catch(err => {
      res.status(593).send({
        message:
          `Cannot get comp with id=${complaintid} and against =${against}. `
      });
    });
};

// not used
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(414).send({
          message: `Cannot find Tutorial with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};

// Update a  comp status
exports.updatecompstatus = (req, res) => {
  if(req.body.status)
  {
    Tutorial.update({
      status: "false"
     }, {
      where: { complaintid: req.body.complaintid }
     })
     .then(data => {
       ComplaintHistory.update({
        status: "false"
       }, {
        where: { complaintComplaintid: req.body.complaintid }
       })
      
        res.send({ message: "Complaint enabled successfully!" });
     
    })
    .catch(err => {
      res.status(529).send({
        message:
          err.message || "Some error in enabling."
      });
    }); 

  }
  else
  {
    Tutorial.update({
      status: "true"
     }, {
      where: { complaintid: req.body.complaintid },
   
     })
     .then(data => {
      ComplaintHistory.update({
        status: "true"
       }, {
        where: { complaintComplaintid: req.body.complaintid }
       })
      
        res.send({ message: "Complaint disabled successfully!" });
     
    })
    .catch(err => {
      res.status(531).send({
        message:
          err.message || "Some error in disabling."
      });
    }); 
  }
  
};

// Delete a comp NOT USED
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all comp from the database NOT USED.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Labib update complaints
exports.update = async (req, res) => {
  
  let creator = await User.findOne({
    where: {
      nsuid: req.userId
    }
  });
  let against = await User.findOne({
    where: {
      nsuid: req.body.against
    }
  });
  let reviewer = await User.findOne({
    where: {
      nsuid: req.body.reviewer
    }
  });
  let compToEdit = await Tutorial.update(// updating the edited comp
    {
      title: req.body.title,
    against: req.body.against,
    body: req.body.body,
    reviewer: req.body.reviewer,
    category: req.body.category,
   evidence:req.body.evidence
    },{
    where: {
      complaintid:req.body.complaintid,
      createdby: req.userId,
      status:0

    }
  });
  // });
  // let agaisnt = await User.findOne({
  //   where: {
  //     nsuid: req.body.against
  //   }
  // });
  // let reviewer = await User.findOne({
  //   where: {
  //     nsuid: req.body.reviewer
  //   }
  // });


// Results will be an empty array and metadata will contain the number of affected rows.
  let compHistory = await ComplaintHistory.findOne(// finds the complaint history for edit
{
   
    where: {
      complaintComplaintid:req.body.complaintid,
      createdby: req.userId,
      status:0
    },
    order: [ [ 'complaintVersion', 'DESC' ]]
  });

  var version = compHistory.complaintVersion;
  console.log(compHistory);
  version = parseFloat(version) +.01,
  
  console.log(version)
  const update = {
    complaintVersion: version,
    title: req.body.title,
    date:req.body.date,
    against: req.body.against,
    body: req.body.body,
    reviewer: req.body.reviewer,
    category: req.body.category,
    createdby: req.userId,
    evidence:req.body.evidence,
    status: req.body.status,
    complaintComplaintid:req.body.complaintid,
  };

  // Save comp in the database of table complainthistory 
  ComplaintHistory.create(update)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(527).send({
        message:
          "Some error occurred while creating the complaint."
      });
    });
//activate nodemailer for any edits made
  transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: creator.email,
    subject: "Your complaint has been edited.",
    html: `<p>Your complaint has been edited: ${creator.name}, (${creator.nsuid})</p>
    <h2> Complaint: ${req.body.title}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
  transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: against.email,
    subject: "A complaint made against you has been edited.",
    html: `<p>A complaint made against you by  ${creator.name}, (${creator.nsuid}) has been edited, </p>
    <h2> Complaint: ${req.body.title}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
  transporter.sendMail({
    from: "nsucomplaints.noreply@gmail.com",
    to: reviewer.email,
    subject: "You are asked to review a complaint",
    html: `<p>You are asked to review a complaint by: ${creator.name}, (${creator.nsuid})</p>
    <h2> Complaint: ${req.body.title}</h2>
    <a target="_blank" href="http://localhost:3000/dashboard">View Complaint</a>
    `,
  })
};

// Labib get versions of complaints to display on front end, edit history basically
exports.findVersions = (req, res) => {
  //res.json(req);
 //RECEIVED!!!!
 const complaintid= req.userId;
 ComplaintHistory.findAll({where: { complaintComplaintid:req.query.complaintid}, order: [ ['updatedAt','DESC'] ]})
  
    .then(data => {
      res.send(data); 
      console.log("from backend");

      console.log(data);
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          `Cannot get comp with id=${complaintid} and against =${against}. `
      });
    });
};
