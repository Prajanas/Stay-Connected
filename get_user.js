import { database } from "../../other/firebase.config";
import { ref, get } from "firebase/database";

const getUser = async (user_id) => {
  try {
    const userRef = ref(database, `users/${user_id}`);
    const user = await get(userRef);
    return user.exists();
  } catch (error) {
    throw new Error("Error while getting user");
  }
};

export { getUser };
