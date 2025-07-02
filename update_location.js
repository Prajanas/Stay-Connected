import { database } from "../../other/firebase.config";
import { ref, update } from "firebase/database";

const updateLocation = async (user_id, location) => {
  try {
    const userRef = ref(database, `users/${user_id}`);
    await update(userRef, { user_location: location });
  } catch (error) {
    throw new Error("Error while updating location");
  }
};

export { updateLocation };
