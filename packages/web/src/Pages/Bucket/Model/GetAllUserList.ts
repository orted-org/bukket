import { makeAllUserListGetCall } from "../../../Http/Http.Bucket";
import { UserType } from "./Types";

interface UserListType extends UserType {
    isSelected: boolean
}
export default function getAllUserList(bucketId: string, request: boolean) {
    return new Promise<UserListType[]>((resolve, reject) => {
        makeAllUserListGetCall(bucketId, request).then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    const finalList: UserListType[] = []
                    const userList = data.userList;
                    for (let i = 0; i < userList.length; i++) {
                        const item = userList[i];
                        const temp: UserListType = {
                            userId: item._id as string,
                            userName: (item.firstName + " " + (item.lastName || "")) as string,
                            userEmail: item.email as string,
                            isSelected: false
                        }
                        finalList.push(temp);
                    }
                    return resolve(finalList)
                })
            } else if (res.status === 403) {
                return reject({ status: 400 })
            } else throw new Error()
        }).catch(err => {
            return reject({ status: err.status || 500 })
        })
    })
}