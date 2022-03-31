const Limits = {
    bucketName: {
        min: 1,
        max: 45
    },
    bucketDescription: {
        min: 0,
        max: 300
    },
    bucketItemName: {
        min: 3,
        max: 45
    },
    bucketItemDescription: {
        min: 0,
        max: 300
    },
    tags: {
        min: 0, max: 15
    },
    remark: {
        min: 0, max: 65
    }
}


const CheckLimit = {
    bucketName: (text: string) => {
        if (text.length < Limits.bucketName.min || text.length > Limits.bucketName.max)
            return false;
        return true
    }, bucketDescription: (text: string) => {
        if (text.length > Limits.bucketDescription.max)
            return false;
        return true
    }, bucketItemName: (text: string) => {
        if (text.length < Limits.bucketItemName.min || text.length > Limits.bucketItemName.max)
            return false;
        return true
    }, bucketItemDescription: (text: string) => {
        if (text.length > Limits.bucketItemDescription.max)
            return false;
        return true
    }
}
export { CheckLimit, Limits }