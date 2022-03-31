import { Endpoints } from "./HttpHelper"

function makeBucketQuitCall(bucketId: string) {
    return fetch(Endpoints.quitBucket, {
        method: "POST",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketId }),
    })
}

export { makeBucketQuitCall }