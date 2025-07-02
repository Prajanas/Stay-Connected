import { database } from "../../other/firebase.config";
import { ref, remove, get, update } from "firebase/database";

const deleteGroup = async (group_id) => {
  try {
    const groupRef = ref(database, `groups/${group_id}`);
    const groupSnapshot = await get(groupRef);

    if (!groupSnapshot.exists()) {
      throw new Error("Group does not exist");
    }

    const groupData = groupSnapshot.val();
    const groupMembers = groupData.group_members || [];

    // Remove the group from each member's joined_group field
    const updateUserPromises = groupMembers.map(async (member) => {
      const userRef = ref(database, `users/${member.user_id}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (userData && userData.joined_group === group_id) {
        return update(userRef, {
          joined_group: null,
        });
      }

      return Promise.resolve();
    });

    await Promise.all(updateUserPromises);

    // Delete the group itself
    await remove(groupRef);

    return group_id;
  } catch (error) {
    throw new Error("Error deleting group");
  }
};

export { deleteGroup };
