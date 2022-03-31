import styled, { useTheme } from "styled-components";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../MicroComponents/Buttons";
import { makeJoinRequestPostCall } from "../Http/Http.Request";
import { useHistory } from "react-router";
import { SVG } from "../AuxComponents/IconPack";
import LoadingAnimation from "../Components/LoadingAnimation";
const MainContainer = styled.section`
  min-height: calc(100vh - 50px);
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: 400;
  z-index: 1;
  padding-top: 70px;
  color: ${(props) => props.theme.primaryText};
`;
const TopContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  min-height: 60px;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  z-index: 8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 10px;
  color: ${(props) => props.theme.secondaryText};
  font-weight: 400;
  align-items: flex-end;
`;
const IconContainer = styled.div`
  height: 110px;
  width: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  padding: 10px;
  & > svg {
    height: 100px;
    width: 100px;
  }
`;
const Message = styled.p`
  margin-top: 25px;
  margin-bottom: 25px;
  width: 85%;
  max-width: 400px;
  color: ${(props) => props.theme.secondaryText};
  font-size: 1.1em;
  font-weight: 400;
  text-align: center;
`;
function checkLink(bucketLink: string) {
  if (bucketLink.includes("bucket?id=")) {
    const bucketId = bucketLink.split("=")[1];
    if (bucketId.length === 24) return bucketId;
  }
  return null;
}
interface JoinProps {
  directCall?: boolean;
}
function Join(props: JoinProps) {
  document.title = "Join Bucket | Bukket";
  const theme = useTheme() as any;
  const history = useHistory();
  const [isJoiningButtonLoading, setIsJoiningButtonLoading] = useState(false);
  const url = window.location.href;
  let bucketId = checkLink(url);
  let isDirectCall = props.directCall || false;
  if (history.location.state !== undefined) {
    const state = history.location.state as any;
    if (state.bucketId !== undefined) {
      bucketId = state.bucketId;
      isDirectCall = false;
    }
  }
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [result, setResult] = useState(-1);
  function makeNetworkCall() {
    setIsPageLoading(true);
    makeJoinRequestPostCall(bucketId || "")
      .then((res) => {
        setIsPageLoading(false);
        setIsJoiningButtonLoading(false);
        if (res.status === 200) {
          setResult(1);
        } else if (res.status === 404 || res.status === 422) {
          //bucket does not exist
          setResult(0);
        } else if (res.status === 409) {
          //redirect
          history.push("/bucket?id=" + bucketId);
        }
      })
      .catch((err) => {
        setIsPageLoading(false);
        setIsJoiningButtonLoading(false);
        setResult(-1);
      });
  }

  useEffect(() => {
    if (bucketId && !isDirectCall) {
      setResult(2);
      //looks like you are not part of this bucket
      // show button
    }
    if (!bucketId) {
      //redirect to 404

      history.push("/not-found");
      setResult(-5);
    }
    if (bucketId && isDirectCall) {
      //direct call network
      // don't show button
      makeNetworkCall();
    }
  }, [bucketId, history, isDirectCall]);
  let icon;
  let color;
  if (result === 1) {
    icon = SVG.tick;
    color = theme.primaryGreen;
  } else if (result === 0 || result === -1) {
    icon = SVG.exclamationCircle;
    color = theme.primaryRed;
  }
  let message = "";
  switch (result) {
    case -1:
      message = "Something went unexpected, please try again later.";
      break;
    case 0:
      message =
        "The bucket you are requesting to join does not exists or was deleted.";
      break;
    case 1:
      message =
        "Request sent for joining the bucket. You can access the bucket contents after the bucket admin approves your request.";
      break;
    case 2:
      icon = SVG.info;
      color = "#fcce4b";
      message =
        "Looks like you are not part of this bucket. Would you like to send request to join this bucket?";
      break;
  }

  return (
    <MainContainer>
      <TopContainer>Request Join Bucket</TopContainer>
      {isPageLoading ? (
        <LoadingAnimation />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <IconContainer style={{ color: color }}>{icon}</IconContainer>
          <Message>{message}</Message>
          <PrimaryButton
            isDisabled={!bucketId}
            text="Send Request"
            isLoading={isJoiningButtonLoading}
            style={{
              height: "50px",
              width: "fit-content",
              display:
                isDirectCall || !bucketId || result === 1 ? "none" : "flex",
            }}
            onClick={() => {
              setIsJoiningButtonLoading(true);
              makeNetworkCall();
            }}
          />
        </div>
      )}
    </MainContainer>
  );
}

export default Join;
