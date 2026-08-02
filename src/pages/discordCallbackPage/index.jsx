import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/header/index.jsx";
import { connectDiscordAccountRequest } from "@/api/userApi.js";
import "./index.css";

const NOTIFICATION_SETTINGS_PATH = "/users/notifications";

function DiscordCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("connecting");
  const [errorMessage, setErrorMessage] = useState("");
  const processedCodeRef = useRef(null);

  useEffect(() => {
    document.title = "디스코드 연동";
  }, []);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setStatus("error");
      setErrorMessage("디스코드 인증 코드가 없습니다.");
      return;
    }

    if (processedCodeRef.current === code) {
      return;
    }

    processedCodeRef.current = code;

    const isPopup = Boolean(window.opener);

    connectDiscordAccountRequest(code)
      .then(() => {
        setStatus("success");

        if (isPopup) {
          window.opener.postMessage({ type: "discord-connected" }, window.location.origin);
          window.setTimeout(() => window.close(), 800);
          return;
        }

        window.setTimeout(() => {
          navigate(NOTIFICATION_SETTINGS_PATH, { replace: true });
        }, 1200);
      })
      .catch((error) => {
        console.error("디스코드 연동 실패:", error);
        setStatus("error");
        setErrorMessage(error.message || "디스코드 연동에 실패했습니다.");
      });
  }, [searchParams, navigate]);

  const isPopup = Boolean(window.opener);

  return (
    <>
      <Header type="withBack" />

      <main className="discord-callback">
        {status === "connecting" && (
          <p className="discord-callback__text">디스코드 계정을 연동하는 중입니다...</p>
        )}

        {status === "success" && (
          <p className="discord-callback__text discord-callback__text--success">
            디스코드 계정이 연동되었습니다!
          </p>
        )}

        {status === "error" && (
          <>
            <p className="discord-callback__text discord-callback__text--error">{errorMessage}</p>
            <button
              className="discord-callback__button"
              type="button"
              onClick={() => {
                if (isPopup) {
                  window.close();
                  return;
                }

                navigate(NOTIFICATION_SETTINGS_PATH, { replace: true });
              }}
            >
              {isPopup ? "창 닫기" : "알림 설정으로 돌아가기"}
            </button>
          </>
        )}
      </main>
    </>
  );
}

export default DiscordCallbackPage;
