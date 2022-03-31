import { Endpoints } from "./HttpHelper"
function makeBucketsGetCall(created: boolean) {
    const url = created ? Endpoints.created_buckets : Endpoints.joined_buckets
    return fetch(url, {
        method: "GET",
        credentials: "include",
    })
}
function makeCreateBucketPostCall(bucketName: string, bucketDescription: string) {

    return fetch(Endpoints.createBucket, {
        method: "POST",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketName, bucketDescription }),
    })
}
function makeBucketItemsGetCall(bucketId: string) {
    const url = Endpoints.getBucketItemsWithBucketDetails + `?id=${bucketId}`
    return fetch(url, {
        method: "GET",
        credentials: "include",
    })
}
function makeBucketDeleteCall(bucketId: string) {
    return fetch(Endpoints.deleteBucket, {
        method: "DELETE",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketId }),
    })
}
function makeAllUserListGetCall(bucketId: string, request: boolean) {
    const url = (request ? Endpoints.getAllRequests : Endpoints.getBucketMembers) + "?id=" + bucketId
    return fetch(url, {
        method: "GET",
        credentials: "include"
    })
}

export { makeBucketsGetCall, makeCreateBucketPostCall, makeBucketItemsGetCall, makeBucketDeleteCall, makeAllUserListGetCall }
