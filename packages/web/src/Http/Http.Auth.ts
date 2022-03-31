import { Endpoints } from "./HttpHelper"
function makeLoginPostCall(googleIdToken: String) {
    return fetch(Endpoints.loginPost, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleIdToken }),
    })
}
function makeLoginGetCall() {
    return fetch(Endpoints.loginPost, {
        method: "GET",
        credentials: "include",
    })
}
function makeLogoutCall() {
    return fetch(Endpoints.logout, {
        credentials: "include",
        method: "DELETE",
    })
}
export { makeLoginPostCall, makeLogoutCall, makeLoginGetCall }