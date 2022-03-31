import Config from "./HttpConfig"
const Endpoints = {
    loginPost: MakeURL("/auth/login"),
    logout: MakeURL("/auth/logout"),
    created_buckets: MakeURL("/?tag=0"),
    joined_buckets: MakeURL("/?tag=-1"),
    joinRequest: MakeURL("/request/join"),
    createBucket: MakeURL("/create"),
    getBucketItemsWithBucketDetails: MakeURL("/bucket"),
    manageRemark: MakeURL("/item/manage-remark"),
    editBucketDetails: MakeURL("/setting/details"),
    deleteBucket: MakeURL("/delete"),
    quitBucket: MakeURL("/user/exit"),
    getAllRequests: MakeURL("/request"),
    getBucketMembers: MakeURL("/setting"),
    removeUsers: MakeURL("/setting/manage-user"),
    manageRequest: MakeURL("/request/manage"),
    addItem: MakeURL("/item/add"),
    editItem: MakeURL("/item/edit"),
    deleteItem: MakeURL("/item/delete")
}
function MakeURL(endpoint: string) {
    return Config.baseUrl + endpoint;
}

export { Endpoints }