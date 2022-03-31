import { createContext } from "react"
import { PrimaryAlertProps } from "../Components/Alerts"
interface DarkThemeType {
    isDarkMode: boolean;
    setIsDarkMode: (b: boolean) => void;
}
const DarkModeContext = createContext<DarkThemeType>({
    isDarkMode: false,
    setIsDarkMode: () => { }
});
interface UserAuthType {
    isUserLoggedIn: boolean;
    setUserLoggedIn: (b: boolean) => void;
}
const UserAuthContext = createContext<UserAuthType>({
    isUserLoggedIn: false,
    setUserLoggedIn: () => { }
});

interface AlertType {
    alertConfig: PrimaryAlertProps
    setAlertConfig: (config: PrimaryAlertProps) => void
}
const AlertContext = createContext<AlertType>({
    alertConfig: {
        isShowing: false,
        level: 1,
        closeOnClick: () => { }
    },
    setAlertConfig: () => { }
})
interface TabType {
    activeTab: number,
    setActiveTab: (id: number) => void
}
const TabContext = createContext<TabType>({
    activeTab: 1,
    setActiveTab: () => { }
})
export { DarkModeContext, UserAuthContext, AlertContext, TabContext }