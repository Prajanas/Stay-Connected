import { database } from "../../other/firebase.config";
import { get, ref, set, update } from "firebase/database";

const createGroup = async (group_name, admin_id, group_id) => {
  try {
    const userRef = ref(database, `users/${admin_id}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    // Create the group and add admin's data to group_members
    const groupRef = ref(database, `groups/${group_id}`);
    await set(groupRef, {
      group_name: group_name,
      admin_id,
      group_members: [
        {
          user_id: admin_id,
          user_name: userData.user_name,
          user_email: userData.user_email,
          user_photo: userData.user_photo,
        },
      ],
    });

    // Update user's joined_group field
    await update(userRef, {
      joined_group: group_id,
    });

    return true;
  } catch (error) {
    throw "Error creating group";
  }
};

export { createGroup };
