import { makeBucketItemsGetCall } from "../../../Http/Http.Bucket"
import { BucketItemType, BucketType } from "./Types"
interface getBucketItemsType {
    bucketDetails: BucketType,
    bucketItemList: BucketItemType[],
    isAdmin: boolean,
    userCount: number,
    isNotification: boolean
}
function getBucketItems(bucketId: string) {
    return new Promise<getBucketItemsType>((resolve, reject) => {
        makeBucketItemsGetCall(bucketId).then(res => {
            if (res.status === 404) {
                return reject({ status: 404 })
            } else if (res.status === 200) {
                res.json().then(data => {
                    const bucketDetails: BucketType = {
                        bucketId: data._id,
                        bucketName: data.bucketName,
                        bucketDescription: data.bucketDescription,
                        bucketCreateDate: data.bucketCreateDate,
                        bucketAdmin: data.bucketAdmins[0].firstName + " " + (data.bucketAdmins[0].lastName || "")
                    }
                    const finalList: BucketItemType[] = []
                    const bucketItems = data.bucketItems;
                    for (let i = 0; i < bucketItems.length; i++) {
                        const item = bucketItems[i];

                        const temp: BucketItemType = {
                            bucketItemId: item._id + "",
                            bucketItemName: item.bucketItemName + "",
                            bucketItemDescription: item.bucketItemDescription + "", bucketItemCreateDate: item.bucketItemCreateDate + "",
                            bucketItemLink: item.bucketItemLink + "",
                            bucketItemTags: item.bucketItemTag as string[],
                            remark: item.remark
                        }
                        finalList.push(temp)
                    }
                    const isAdmin = data.isAdmin as boolean
                    const userCount = data.userCount as number
                    const isNotification = data.isNewRequest as boolean
                    return resolve({ bucketDetails, bucketItemList: finalList, isAdmin, userCount, isNotification })
                })
            } else throw new Error()
        }).catch(err => {
            return reject({ status: err.status || 500 })
        })
    })
}

export default getBucketItems