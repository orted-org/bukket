import styled from "styled-components";
import { PrimaryAlert, PrimaryAlertProps } from "../Components/Alerts";
import { useContext, useState } from "react";
import { PrimaryButton } from "../MicroComponents/Buttons";
import { PrimaryInputText } from "../MicroComponents/InputText";
import OrTag from "../MicroComponents/OrTag";
import { PrimaryTextArea } from "../MicroComponents/InputTextArea";
import { CheckLimit, Limits } from "../AuxComponents/LimitConfig";
import { makeJoinRequestPostCall } from "../Http/Http.Request";
import { makeCreateBucketPostCall } from "../Http/Http.Bucket";
import { useHistory } from "react-router";
import { UserAuthContext } from "../AuxComponents/Contexts";
const MainContainer = styled.section`
  min-height: calc(100vh - 50px);
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
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
const JoinContainer = styled.div`
  height: fit-content;
  width: 90%;
  max-width: 500px;
  margin: 30px auto;
  display: flex;
`;
const CreateContainer = styled.div`
  height: fit-content;
  width: 90%;
  max-width: 500px;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`;

function checkLink(bucketLink: string) {
  if (bucketLink.includes("bucket?id=")) {
    const bucketId = bucketLink.split("=")[1];
    if (bucketId.length === 24) return bucketId;
  }
  return null;
}
function CreateJoin() {
  document.title = "Create/Join | Bukket";
  const history = useHistory();
  const { setUserLoggedIn } = useContext(UserAuthContext);
  const [alertConfig, setAlertConfig] = useState<PrimaryAlertProps>({
    isShowing: false,
    level: 1,
    closeOnClick: onCloseAlert,
  });
  const [joiningLink, setJoiningLink] = useState("");
  const [isJoiningButtonLoading, setIsJoiningButtonLoading] = useState(false);
  const [isCreateButtonLoading, setIsCreateButtonLoading] = useState(false);
  const [creatBucketDetails, setCreateBucketDetails] = useState({
    bucketName: "",
    bucketDescription: "",
  });
  function onCloseAlert() {
    setAlertConfig((prevState) => {
      return {
        ...prevState,
        isShowing: false,
        level: prevState.level,
      };
    });
  }
  return (
    <MainContainer>
      <PrimaryAlert {...alertConfig} />
      <TopContainer>Create / Join Bucket</TopContainer>
      <JoinContainer>
        <PrimaryInputText
          placeholder="Enter bucket link"
          value={joiningLink}
          onChange={(e) => {
            setJoiningLink(e.target.value);
          }}
        />
        <PrimaryButton
          isDisabled={!(joiningLink.trim().length > 0)}
          text="Join"
          isLoading={isJoiningButtonLoading}
          style={{ height: "50px", width: "fit-content" }}
          onClick={() => {
            if (checkLink(joiningLink) === null) {
              setAlertConfig({
                isShowing: true,
                level: -1,
                closeOnClick: onCloseAlert,
                heading: "Invalid Joining Link",
              });
              return;
            }
            setIsJoiningButtonLoading(true);
            makeJoinRequestPostCall(checkLink(joiningLink) || "")
              .then((res) => {
                setIsJoiningButtonLoading(false);
                if (res.status === 401) {
                  history.push("/");
                  setUserLoggedIn(false);
                } else if (res.status === 200) {
                  setAlertConfig({
                    isShowing: true,
                    level: 1,
                    closeOnClick: onCloseAlert,
                    heading: "Joining Request Sent",
                    message:
                      "The request to join this bucket has been sent to the bucket admin.",
                  });
                } else if (res.status === 404 || res.status === 422) {
                  setAlertConfig({
                    isShowing: true,
                    level: -1,
                    closeOnClick: onCloseAlert,
                    heading: "No Such Bucket Exist",
                  });
                } else if (res.status === 409) {
                  setAlertConfig({
                    isShowing: true,
                    level: 0,
                    closeOnClick: onCloseAlert,
                    heading: "Already Part of Bucket",
                    message:
                      "You are already part of this bucket. Cannot make join request.",
                  });
                }
              })
              .catch((err) => {
                setIsJoiningButtonLoading(false);
                setAlertConfig({
                  isShowing: true,
                  level: -1,
                  closeOnClick: onCloseAlert,
                  heading: "Something Went Wrong",
                  message:
                    "Something went unexpected on our side, please try again later.",
                });
              });
          }}
        />
      </JoinContainer>
      <OrTag />

      <CreateContainer>
        <h3 style={{ width: "100%", opacity: 0.6, marginBottom: "10px" }}>
          Create New Bucket
        </h3>
        <PrimaryInputText
          limit={Limits.bucketName.max}
          placeholder="Enter bucket name"
          value={creatBucketDetails.bucketName}
          onChange={(e) => {
            setCreateBucketDetails((prevState) => {
              return { ...prevState, bucketName: e.target.value };
            });
          }}
        />
        <PrimaryTextArea
          limit={Limits.bucketDescription.max}
          value={creatBucketDetails.bucketDescription}
          placeholder="Short bucket description"
          style={{ marginTop: "20px" }}
          onChange={(e) => {
            setCreateBucketDetails((prevState) => {
              return { ...prevState, bucketDescription: e.target.value };
            });
          }}
        />
        <PrimaryButton
          isDisabled={
            !(
              CheckLimit.bucketDescription(
                creatBucketDetails.bucketDescription
              ) && CheckLimit.bucketName(creatBucketDetails.bucketName)
            )
          }
          text="Create Bucket"
          isLoading={isCreateButtonLoading}
          style={{ height: "50px", width: "fit-content", marginTop: "30px" }}
          onClick={() => {
            setIsCreateButtonLoading(true);
            makeCreateBucketPostCall(
              creatBucketDetails.bucketName,
              creatBucketDetails.bucketDescription
            )
              .then((res) => {
                setIsCreateButtonLoading(false);
                if (res.status === 401) {
                  history.push("/");
                  setUserLoggedIn(false);
                } else if (res.status === 201) {
                  res.json().then((data) => {
                    const bucketId = data._id;
                    history.push(`/bucket?id=${bucketId}`);
                  });
                } else {
                  setAlertConfig({
                    isShowing: true,
                    level: -1,
                    closeOnClick: onCloseAlert,
                    heading: "Bucket Not Created",
                    message:
                      "Bucket could not be created due to some reasons, please try again, later.",
                  });
                }
              })
              .catch((err) => {
                setIsCreateButtonLoading(false);
                setAlertConfig({
                  isShowing: true,
                  level: -1,
                  closeOnClick: onCloseAlert,
                  heading: "Something Went Wrong",
                  message:
                    "Something went unexpected on our side, please try again later.",
                });
              });
          }}
        />
      </CreateContainer>
    </MainContainer>
  );
}

export default CreateJoin;
