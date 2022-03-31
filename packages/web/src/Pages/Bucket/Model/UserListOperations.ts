
import { UserType } from "./Types";
interface UserListType extends UserType {
    isSelected: boolean
}
function getSelectedUserIds(userList: UserListType[]) {
    const selectedUserIds: string[] = []
    for (let i = 0; i < userList.length; i++) {
        const item = userList[i];
        if (item.isSelected) {
            selectedUserIds.push(item.userId)
        }
    }
    return selectedUserIds
}
function adjustUserList(selectedUserIds: string[], userList: UserListType[]) {
    const returnList: UserListType[] = []
    for (let j = 0; j < userList.length; j++) {
        let found: boolean = false;
        for (let i = 0; i < selectedUserIds.length; i++) {
            if (userList[j].userId === selectedUserIds[i]) { found = true; break }
        }
        if (!found) {
            userList[j].isSelected = false;
            returnList.push(userList[j]);
        }
    }
    return returnList
}
export { getSelectedUserIds, adjustUserList }