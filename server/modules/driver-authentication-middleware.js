const rejectNotDriver = (req, res, next) => {
  // check if logged in & if account type is driver level or above
  if (req.isAuthenticated() && req.user.account_type >= 0) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

module.exports = { rejectNotDriver };
