//http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listGroupsForUser-property

const express = require('express');

const aws = require('aws-sdk');

//credentials
const users = require('./config/user')
const policy = require('./config/policy')

var credentials = new aws.SharedIniFileCredentials({profile: 'admin'});
aws.config.credentials = credentials;
const iam = new aws.IAM();

if (typeof Promise === 'undefined'){
  aws.config.setPromiseDependency(require('bluebird'));
  console.log('had to use bluebird');
}
else{
  console.log('global promise was found!')
}

// const passportSetup = require('./config/passport-setup');

// import routes
const authRoutes = require('./routes/auth-routes');

const app = express();

const createUser = (userName) => {
  let params = {
    UserName: userName,
    Path: '/'
  };
  return iam.createUser(params, function(err, data){
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};

const createGroup = (groupName) => {
  let params = {
    GroupName: groupName,
    Path: '/'
  };
  return iam.createGroup(params, function(err, data){
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};

const addUserToGroup = (groupName, userName) => {
  let params = {
    GroupName: groupName,
    UserName: userName
  };
  return iam.addUserToGroup(params, function(err, data){
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};

const createPolicy = (policyDocument, policyName) => {
  let params = {
    PolicyDocument: policyDocument,
    PolicyName: policyName
  };
  return iam.createPolicy(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};

Object.values(policy).forEach(function (pol){
  createPolicy(JSON.stringify(pol.PolicyDocument), pol.PolicyName)
  //console.log(JSON.stringify(pol.PolicyDocument))
});

//Creating Users/Groups and adding users to groups
Object.values(users).forEach(function (key) {
  console.log(key);
  createGroup(key.GroupName);
  createUser(key.UserName);
  addUserToGroup(key.GroupName, key.UserName)
  // iam.deleteUser(key, function(err, data){
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else     console.log(data);           // successful response
  // });
});

// CREATING USER
// iam.createUser(params, function(err, data){
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

// LISTING USERS
par = {};
iam.listUsers(par, function(err, data){
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

// set up ejs view
app.set('view engine', 'ejs');

// set up routes
app.use('/auth', authRoutes);

// homepage route
app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () => {
  console.log('app is listening on port 3000');
});

//console.log(keys.admin_iam.aws_access_key_id)
