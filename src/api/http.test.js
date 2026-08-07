

import { BASE_URL, request } from "./http.js";

let fetchMock;

// 가짜 JSON응답 함수..
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

beforeEach(() => {
  fetchMock = vi.fn();

  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("location", { href: "http://localhost/" });
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("request", () => {
  it("JSON 응답을 반환하고 기본 요청 헤더를 설정한다", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: { id: 1 } }));

    const result = await request("/users/me");

    expect(result).toEqual({ data: { id: 1 } });
    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/users/me`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("accessToken이 있으면 Authorization 헤더를 추가한다", async () => {
    localStorage.setItem("accessToken", "access-token");
    fetchMock.mockResolvedValue(jsonResponse({ data: {} }));

    await request("/users/me");

    expect(fetchMock.mock.calls[0][1].headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer access-token",
    });
  });

  it("FormData 요청에는 Content-Type을 직접 추가하지 않는다", async () => {
    const formData = new FormData();
    formData.append("nickname", "hazel");
    fetchMock.mockResolvedValue(jsonResponse({ data: {} }));

    await request("/users/me", {
      method: "PATCH",
      body: formData,
    });

    const [, options] = fetchMock.mock.calls[0];

    expect(options.body).toBe(formData);
    expect(options.headers).toEqual({});
  });

  it("204 응답이면 null을 반환한다", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    const result = await request("/users/logout", { method: "POST" });

    expect(result).toBeNull();
  });

  it("실패 응답에 message가 있으면 해당 메시지로 예외를 발생시킨다", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ message: "권한이 없습니다." }, 403),
    );

    await expect(request("/private")).rejects.toThrow("권한이 없습니다.");
  });

  it("실패 응답을 JSON으로 읽을 수 없으면 기본 메시지로 예외를 발생시킨다", async () => {
    fetchMock.mockResolvedValue(new Response("invalid", { status: 500 }));

    await expect(request("/broken")).rejects.toThrow("API 요청 실패");
  });

  it("401 응답을 받으면 토큰을 재발급하고 원래 요청을 한 번 재시도한다", async () => {
    localStorage.setItem("accessToken", "old-token");
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ message: "만료" }, 401))
      .mockResolvedValueOnce(
        jsonResponse({ data: { accessToken: "new-token" } }),
      )
      .mockResolvedValueOnce(jsonResponse({ data: { id: 1 } }));

    const result = await request("/private");

    expect(result).toEqual({ data: { id: 1 } });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1]).toEqual([
      `${BASE_URL}/users/token/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    ]);
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe(
      "Bearer new-token",
    );
  });

  it("동시에 여러 요청이 401을 받아도 토큰 재발급은 한 번만 실행한다", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(
        jsonResponse({ data: { accessToken: "new-token" } }),
      )
      .mockResolvedValueOnce(jsonResponse({ data: { id: 1 } }))
      .mockResolvedValueOnce(jsonResponse({ data: { id: 2 } }));

    const results = await Promise.all([
      request("/first"),
      request("/second"),
    ]);

    expect(results).toEqual([
      { data: { id: 1 } },
      { data: { id: 2 } },
    ]);
    expect(
      fetchMock.mock.calls.filter(
        ([url]) => url === `${BASE_URL}/users/token/refresh`,
      ),
    ).toHaveLength(1);
  });

  it("토큰 재발급에 실패하면 세션 만료 에러를 발생시키고 인증 데이터를 삭제한다", async () => {
    localStorage.setItem("accessToken", "old-token");
    localStorage.setItem("tokenType", "Bearer");
    localStorage.setItem("userId", "1");
    fetchMock
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(jsonResponse({}, 500));

    await expect(request("/private")).rejects.toThrow(
      "세션이 만료되었습니다.",
    );

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("tokenType")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
    expect(location.href).toBe("/login");
  });

  it("재시도 요청도 401이면 세션 만료 에러를 발생시킨다", async () => {
    localStorage.setItem("accessToken", "old-token");
    fetchMock
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(
        jsonResponse({ data: { accessToken: "new-token" } }),
      )
      .mockResolvedValueOnce(jsonResponse({}, 401));

    await expect(request("/private")).rejects.toThrow(
      "세션이 만료되었습니다.",
    );

    expect(location.href).toBe("/login");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
