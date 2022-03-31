import { BucketItemType } from "../Pages/Bucket/Model/Types"
import { Endpoints } from "./HttpHelper"
function makeManageRemarkCall(bucketId: string, bucketItemId: string, text: string) {
    return fetch(Endpoints.manageRemark, {
        method: "POST",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketId, bucketItemId, text }),
    })
}
function makeItemAddEditCall(bucketId: string, bucketItemDetails: BucketItemType, isEdit: boolean) {
    let sendingBucketItemDetails = {}
    if (isEdit) {
        sendingBucketItemDetails = {
            bucketId: bucketId,
            bucketItemName: bucketItemDetails.bucketItemName,
            bucketItemDescription: bucketItemDetails.bucketItemDescription,
            bucketItemLink: bucketItemDetails.bucketItemLink,
            bucketItemTag: bucketItemDetails.bucketItemTags,
            bucketItemId: bucketItemDetails.bucketItemId
        }
    } else {
        sendingBucketItemDetails = {
            bucketId: bucketId,
            bucketItemName: bucketItemDetails.bucketItemName,
            bucketItemDescription: bucketItemDetails.bucketItemDescription,
            bucketItemLink: bucketItemDetails.bucketItemLink,
            bucketItemTag: bucketItemDetails.bucketItemTags,
        }
    }

    const url = isEdit ? Endpoints.editItem : Endpoints.addItem
    return fetch(url, {
        method: "POST",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketId, ...sendingBucketItemDetails }),
    })
}

function makeItemDeleteCall(bucketId: string, bucketItemId: string) {
    return fetch(Endpoints.deleteItem, {
        method: "DELETE",
        credentials: "include", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketId, bucketItemId }),
    })
}
export { makeManageRemarkCall, makeItemAddEditCall, makeItemDeleteCall }
