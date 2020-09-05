const firebase = require("../../app/node_modules/firebase/app");
const { auth, db } = require("./app.js");

const signUp = async (email, password) => {
  try {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);

    return user;
  } catch (error) {
    //TODO: Decide if you want to use codes to make custom messgaes on front end
    // const errorCode = error.code;
    return error.message;
  }
};

const createUser = async (uid, email, firstName, lastName, phoneNumber) => {
  try {
    await db.collection("users").doc(uid).set({
      firstName,
      lastName,
      email,
      phoneNumber,
    });
  } catch (error) {
    return error.message;
  }
};

const signIn = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    return error.message;
  }
};

const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    return error.message;
  }
};

const googleAuth = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    return result.user;
  } catch (error) {
    return error.message;
  }
};
