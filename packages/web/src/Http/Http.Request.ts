import { Endpoints } from "./HttpHelper"
function makeJoinRequestPostCall(bucketId: string) {
    return fetch(Endpoints.joinRequest, {
        method: "POST",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketId }),
    })
}

export { makeJoinRequestPostCall }
