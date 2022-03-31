function getDarkThemeStatus() {
    let isDarkThemeEnabled = localStorage.getItem("darkThemeStatus");
    if (isDarkThemeEnabled) {
        return isDarkThemeEnabled === "true"
    }
    return false
}
function setDarkThemeStatus(status: boolean) {
    localStorage.setItem("darkThemeStatus", status === true ? "true" : "false")
}
function setUserDetails(data: any) {
    const user = {
        name: data.firstName + " " + (!(data.lastName === undefined || data.lastName === null) ? data.lastName : ""),
        email: data.email,
        profilePictureUrl: data.profilePictureUrl
    }
    localStorage.setItem("user", JSON.stringify(user))
}
interface UserDetails {
    name: string
    email: string
    profilePictureUrl: string

}
function getUserDetails(): UserDetails | null {
    const user: UserDetails = {
        name: "",
        email: "",
        profilePictureUrl: ""
    }
    const local = localStorage.getItem("user");
    if (local) {
        const item = JSON.parse(local);
        user.name = item.name as string;
        user.email = item.email as string;
        user.profilePictureUrl = item.profilePictureUrl as string;
        return user;
    }
    return null
}
export { getDarkThemeStatus, setDarkThemeStatus, setUserDetails,getUserDetails }