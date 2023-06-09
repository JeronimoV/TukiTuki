const { User, Friends, Posts, Reactions, Favorites } = require("../database");
const bcrypt = require("bcrypt");
const { encrypt, revealEncrypt } = require("../util/encryptData");
const { createAccesToken, verifyToken } = require("../util/jwtEncrypt");
const { Op } = require("sequelize");

const searchBar = async (req, res) => {
  const { search } = req.params;
  try {
    const actualResults = await User.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${search}%` } },
          { nickname: { [Op.like]: `${search}` } },
        ],
      },
    });
    if (!actualResults) {
      throw new Error("No results :(");
    }

    let dataToSend = [];

    for (let i = 0; i < actualResults.length; i++) {
      dataToSend.push({
        nickname: actualResults[i].nickname,
        picture: actualResults[i].picture,
        id: actualResults[i].id,
      });
    }

    res.status(200).json(dataToSend);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getUserIdWithEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const actualUser = await User.findOne({ where: { email: email } });
    if (!actualUser) throw new Error("This user doesnt exist!");
    const allFriends = await Friends.findAll({
      where: { UserId: actualUser.id },
    });

    const dataToSend = {
      id: actualUser.id,
      email: actualUser.email,
      nickname: actualUser.nickname,
      picture: actualUser.picture,
    };
    res.status(200).json({ dataToSend, allFriends });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getUserProfile = async (req, res) => {
  const { nickname } = req.params;
  try {
    const actualUser = await User.findOne({ where: { nickname: nickname } });
    if (!actualUser) {
      throw new Error("User doesnt exist!");
    }
    const allFriends = await Friends.findAll({
      where: { UserId: actualUser.id },
    });

    const allPosts = await Posts.findAll({
      where: { UserId: actualUser.id },
      include: [{ model: Reactions }, { model: Favorites }],
    });

    allPosts.sort((a, b) => {
      if (a.id < b.id) {
        return 1;
      } else {
        return -1;
      }
    });

    const dataToSend = {
      id: actualUser.id,
      email: actualUser.email,
      nickname: actualUser.nickname,
      picture: actualUser.picture,
      description: actualUser.description,
      friends: allFriends,
      posts: allPosts,
    };
    res.status(200).json(dataToSend);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) throw new Error("You need to send an Id!");
    const actualUser = await User.findOne({ where: { id: id } });
    if (!actualUser) throw new Error("User doesnt exist!");
    const actualFriends = await Friends.findAll({ where: { UserId: id } });
    if (!actualFriends) throw new Error("User doesnt have friends!");
    const dataToSend = {
      id: actualUser.id,
      email: actualUser.email,
      nickname: actualUser.nickname,
      picture: actualUser.picture,
      friends: actualFriends,
      description: actualUser.description,
      backgroundPicture: actualUser.backgroundPicture,
      coverPhoto: actualUser.coverPhoto,
    };
    res.status(200).json(dataToSend);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const isUserLogged = (req, res) => {
  const accessToken = req.headers["authorization"];
  try {
    if (accessToken) {
      res.status(200).json("Valid token!");
    } else {
      throw new Error("This user doesn´t have a token!");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const logOutUser = (req, res) => {
  const accessToken = req.headers["authorization"];
  try {
    if (!accessToken) {
      throw new Error("This user is actually not connected!");
    } else {
      delete req.headers["authorization"];
      res.status(200).json("Token deleted!");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);
    const actualUser = await User.findOne({ where: { email: email } });
    if (actualUser) {
      const comparePass = await new Promise((resolve, reject) => {
        bcrypt.compare(password, actualUser.password, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      if (comparePass) {
        const loggedUser = JSON.stringify(actualUser);
        const token = createAccesToken(loggedUser);
        res.status(200).header("authorization", token).json("Login success!");
      } else {
        throw new Error("Email and password doesnt match!");
      }
    } else {
      throw new Error("Email and password doesnt match!");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const createUser = async (req, res) => {
  const { email, password, age } = req.body;
  try {
    if (!email || !password || !age) {
      throw new Error("Please, send all the data!");
    }
    const searchSameEmail = await User.findOne({ where: { email: email } });
    if (searchSameEmail) {
      throw new Error("This email is already registered!");
    }
    if (age < 18) {
      throw new Error("You need to be older than 18!");
    }
    const emailArray = await email.split("@");
    const nickName = emailArray[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    const ageToEncrypt = age.toString();

    const ageEncrypted = encrypt(ageToEncrypt);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      age: ageEncrypted,
      nickname: nickName,
      picture:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
      backgroundPicture:
        "https://steamuserimages-a.akamaihd.net/ugc/856104292500994306/7766E6F16031671F6F1049919D0A28AA8E6B9599/",
      coverPhoto:
        "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y292ZXIlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
    });

    if (!newUser) throw new Error("Failed to create");

    const newUserToString = JSON.stringify(newUser);

    const token = createAccesToken(newUserToString);

    res.status(200).header("authorization", token).json("Register completed!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const updateUser = async (req, res) => {
  let {
    id,
    name,
    lastName,
    email,
    nickname,
    picture,
    age,
    country,
    description,
    backgroundPicture,
    coverPhoto,
  } = req.body;
  try {
    if (
      !id &&
      !name &&
      !lastName &&
      !email &&
      !nickname &&
      !picture &&
      !age &&
      !country
    ) {
      throw new Error("You need to send some data!");
    }

    const userToUpdate = await User.findOne({ where: { id: id } });

    name = encrypt(name);
    lastName = encrypt(lastName);
    country = encrypt(country);

    if (!userToUpdate) throw new Error("User not found!");

    await userToUpdate.update({
      name: name,
      lastName: lastName,
      email: email,
      nickname: nickname,
      picture: picture,
      country: country,
      description: description,
      backgroundPicture: backgroundPicture,
      coverPhoto: coverPhoto,
    });

    res.status(200).json("User updated!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const updatePassword = async (req, res) => {
  const { id, password } = req.body;
  try {
    if (!id || !password) {
      throw new Error("You need to send some data!");
    }

    const userToUpdate = await User.findOne({ where: { id: id } });

    const hashedPassword = await bcrypt.hash(password, 10);

    await userToUpdate.update({
      password: hashedPassword,
    });

    res.status(200).json("Success!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

module.exports = {
  searchBar,
  getUserIdWithEmail,
  getOneUser,
  getUserProfile,
  logOutUser,
  isUserLogged,
  createUser,
  loginUser,
  updateUser,
  updatePassword,
};
