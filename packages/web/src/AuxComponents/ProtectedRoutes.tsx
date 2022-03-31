import { useContext, useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import LoadingAnimation from "../Components/LoadingAnimation";
import { makeLoginGetCall } from "../Http/Http.Auth";
import { UserAuthContext } from "./Contexts";
import React from "react";

const Login = React.lazy(() => import("../Pages/Login"));
const HomePage = React.lazy(() => import("../Pages/HomePage"));
interface ProtectedRoutesProps {
  rest: any;
  children: JSX.Element[];
}
function ProtectedRoutes(props: ProtectedRoutesProps) {
  const { isUserLoggedIn, setUserLoggedIn } = useContext(UserAuthContext);
  const [isAuth, setIsAuth] = useState(null) as any;
  const child = <div>{props.children.map((item) => item)}</div>;
  useEffect(() => {
    if (!isUserLoggedIn) {
      makeLoginGetCall()
        .then((res) => {
          if (res.status === 200) {
            setUserLoggedIn(true);
            setIsAuth(true);
          } else throw new Error();
        })
        .catch((err) => {
          setIsAuth(false);
        });
    } else setIsAuth(true);
  }, [isUserLoggedIn, setUserLoggedIn]);
  if (isAuth === null) {
    return <LoadingAnimation />;
  }
  return (
    <Route
      {...props.rest}
      render={() => {
        let returnVal;
        if (isUserLoggedIn && props.children.length === 0) {
          returnVal = <Redirect to="/created-buckets" />;
        } else if (!isUserLoggedIn && props.children.length === 0) {
          returnVal = <HomePage />;
        } else if (isUserLoggedIn && props.children.length !== 0)
          returnVal = child;
        else returnVal = <Login />;
        return returnVal;
      }}
    />
  );
}
export default ProtectedRoutes;
