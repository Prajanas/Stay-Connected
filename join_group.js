import { database } from "../../other/firebase.config";
import { ref, update, get } from "firebase/database";

const joinGroup = async (group_id, user_id) => {
  try {
    const groupRef = ref(database, `groups/${group_id}`);
    const groupSnapshot = await get(groupRef);

    if (!groupSnapshot.exists()) {
      throw new Error("Group does not exist");
    }

    const groupData = groupSnapshot.val();

    const userRef = ref(database, `users/${user_id}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      throw new Error("User does not exist");
    }

    const userData = userSnapshot.val();

    const group_members = groupData.group_members || [];
    group_members.push({
      user_id: user_id,
      user_name: userData.user_name,
      user_email: userData.user_email,
      user_photo: userData.user_photo,
    });

    const updatedGroup = await update(groupRef, {
      group_members,
    });

    const updatedUser = await update(userRef, {
      joined_group: group_id,
    });

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export { joinGroup };
