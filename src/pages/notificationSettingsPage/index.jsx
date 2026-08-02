import { useEffect, useRef, useState } from "react";
import Header from "@/components/header/index.jsx";
import { getDiscordAuthorizeUrlRequest, getNotificationSettingsRequest, updateNotificationSettingsRequest } from "@/api/userApi.js";
import useBooleanState from "@/utils/useBooleanState.js";
import { CATEGORIES } from "@/utils/categories.js";
import "./index.css";

function NotificationSettingsPage() {
  const toastTimerRef = useRef(null);
  const [discordUserId, setDiscordUserId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  const { value: isSubmitting, setTrue: startSubmitting, setFalse: finishSubmitting } = useBooleanState(false);
  const { value: isSaved, setTrue: markSaved, setFalse: clearSaved } = useBooleanState(false);

  useEffect(() => {
    document.title = "알림 설정";
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setIsToastOpen(true);

    toastTimerRef.current = window.setTimeout(() => {
      setIsToastOpen(false);
      toastTimerRef.current = null;
    }, 1500);
  };

  useEffect(() => {
    let isCancelled = false;

    getNotificationSettingsRequest()
      .then(({ data }) => {
        if (isCancelled) {
          return;
        }

        setDiscordUserId(data.discordUserId ?? "");
        setCategories(data.categories ?? []);
        setLoadErrorMessage("");
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error("알림 설정 조회 실패:", error);
        setLoadErrorMessage(error.message || "알림 설정을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoaded(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleToggleCategory = (value) => {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
    clearSaved();
  };

  const handleDiscordUserIdChange = ({ target: { value } }) => {
    setDiscordUserId(value);
    clearSaved();
  };

  const handleConnectDiscord = async () => {
    try {
      const { data } = await getDiscordAuthorizeUrlRequest();
      window.open(data.url, "discord-oauth", "width=480,height=720");
    } catch (error) {
      console.error("디스코드 인증 URL 조회 실패:", error);
      setErrorMessage(error.message || "디스코드 연결을 시작하지 못했습니다.");
    }
  };

  useEffect(() => {
    function handleDiscordConnected(event) {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== "discord-connected") {
        return;
      }

      getNotificationSettingsRequest()
        .then(({ data }) => {
          setDiscordUserId(data.discordUserId ?? "");
          setCategories(data.categories ?? []);
        })
        .catch((error) => {
          console.error("알림 설정 재조회 실패:", error);
        });

      showToast();
    }

    window.addEventListener("message", handleDiscordConnected);

    return () => {
      window.removeEventListener("message", handleDiscordConnected);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      startSubmitting();

      await updateNotificationSettingsRequest({
        discordUserId: discordUserId.trim(),
        categories,
      });

      setErrorMessage("");
      markSaved();
      showToast();
    } catch (error) {
      console.error("알림 설정 저장 실패:", error);
      setErrorMessage(error.message || "알림 설정 저장에 실패했습니다.");
    } finally {
      finishSubmitting();
    }
  };

  return (
    <>
      <Header type="withBack" />

      <main className="notification-settings-page">
        <h2 className="title">알림 설정</h2>

        {!isLoaded && (
          <p className="notification-settings__loading">알림 설정을 불러오는 중입니다.</p>
        )}

        {isLoaded && loadErrorMessage && (
          <p className="notification-settings__error">{loadErrorMessage}</p>
        )}

        {isLoaded && !loadErrorMessage && (
          <form className="notification-settings-form" onSubmit={handleSubmit}>
            <p className="notification-settings__description">
              선정된 질문이 매일 아침 디스코드로 전달될 때, 받고 싶은 카테고리와 디스코드 사용자 ID를 설정하세요.
            </p>

            <div className="notification-settings__field">
              <label className="notification-settings__label" htmlFor="discordUserId">
                디스코드 계정
              </label>

              <div className="notification-settings__discord-connect">
                <span className="notification-settings__discord-status">
                  {discordUserId ? `연결됨 (ID: ${discordUserId})` : "연결 안 됨"}
                </span>

                <button
                  className="notification-settings__discord-button"
                  type="button"
                  onClick={handleConnectDiscord}
                >
                  {discordUserId ? "다시 연결하기" : "디스코드로 연결하기"}
                </button>
              </div>

              <input
                id="discordUserId"
                className="notification-settings__input"
                type="text"
                placeholder="또는 디스코드 사용자 ID를 직접 입력하세요"
                value={discordUserId}
                onChange={handleDiscordUserIdChange}
              />
            </div>

            <div className="notification-settings__field">
              <span className="notification-settings__label">받고 싶은 카테고리</span>

              <div className="notification-settings__categories">
                {CATEGORIES.map((category) => (
                  <label key={category.value} className="notification-settings__checkbox">
                    <input
                      type="checkbox"
                      checked={categories.includes(category.value)}
                      onChange={() => handleToggleCategory(category.value)}
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            </div>

            {errorMessage && (
              <p className="notification-settings__error">{errorMessage}</p>
            )}

            <button
              className="notification-settings__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : isSaved ? "저장됨" : "저장"}
            </button>
          </form>
        )}

        <div
          className={`toast${isToastOpen ? " is-active" : ""}`}
          role="status"
          aria-live="polite"
        >
          저장완료
        </div>
      </main>
    </>
  );
}

export default NotificationSettingsPage;
