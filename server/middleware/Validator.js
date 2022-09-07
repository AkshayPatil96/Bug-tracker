const validator = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // ? first name
  if (!firstName) {
    return res.status(400).json({ msg: "Please add your first name." });
  } else if (firstName.length > 12) {
    return res
      .status(400)
      .json({ msg: "Your firstName cannot exceed 12 characters." });
  }

  // ? last name
  if (!lastName) {
    return res.status(400).json({ msg: "Please add your last name." });
  } else if (lastName.length > 12) {
    return res
      .status(400)
      .json({ msg: "Your lastName cannot exceed 12 characters." });
  }

  // ? email
  if (!email) {
    return res.status(400).json({ msg: "Please add your email." });
  } else if (!validateEmail(email)) {
    return res.status(400).json({ msg: "Please enter valid email." });
  }

  // ? password
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Your password must be at least 6 characters long." });
  }
  next();
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

module.exports = validator;
