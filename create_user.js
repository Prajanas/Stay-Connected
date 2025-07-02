import { database } from "../../other/firebase.config";
import { ref, set } from "firebase/database";

const createUser = async (user_name, user_email, user_photo, user_id) => {
  try {
    const userRef = ref(database, `users/${user_id}`);
    const user = await set(userRef, {
      user_name,
      user_email,
      user_photo,
      user_id,
    });

    return true;
  } catch (error) {
    throw new Error("Error while creating user");
  }
};

export { createUser };
