import { database } from "../../other/firebase.config";
import { ref, update, get } from "firebase/database";

const leaveGroup = async (group_id, user_id) => {
  try {
    const groupRef = ref(database, `groups/${group_id}`);
    const groupSnapshot = await get(groupRef);

    if (!groupSnapshot.exists()) {
      throw new Error("Group does not exist");
    }

    const groupData = await groupSnapshot.val();

    let group_members = groupData.group_members || [];
    group_members = group_members.filter(
      (member) => member.user_id !== user_id
    );

    const updatedGroup = await update(groupRef, {
      group_members,
    });

    const userRef = ref(database, `users/${user_id}`);
    const updatedUser = await update(userRef, {
      joined_group: null,
    });

    return true;
  } catch (error) {
    throw new Error("Error leaving the group");
  }
};

export { leaveGroup };
