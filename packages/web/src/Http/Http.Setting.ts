import { Endpoints } from "./HttpHelper"

function makeBucketDetailsEditCall(bucketId: string, bucketName: string, bucketDescription: string) {
    return fetch(Endpoints.editBucketDetails, {
        method: "POST",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketId, bucketName, bucketDescription }),
    })

}
function makeRemoveUserCall(bucketId: string, removedUsers: string[]) {
    return fetch(Endpoints.removeUsers, {
        method: "POST",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketId, removedUsers }),
    })
}
function makeManageRequestCall(bucketId: string, addedMembers: string[], rejectedMembers: string[]) {
    return fetch(Endpoints.manageRequest, {
        method: "POST",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketId, addedMembers, rejectedMembers }),
    })
}
export { makeBucketDetailsEditCall, makeRemoveUserCall, makeManageRequestCall }