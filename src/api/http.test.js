const mockAxios = vi.hoisted(() => {
  const state = {
    requestHandler: null,
    responseErrorHandler: null,
  };
  const instance = vi.fn();

  instance.interceptors = {
    request: {
      use: vi.fn((handler) => {
        state.requestHandler = handler;
      }),
    },
    response: {
      use: vi.fn((_, errorHandler) => {
        state.responseErrorHandler = errorHandler;
      }),
    },
  };

  return {
    instance,
    post: vi.fn(),
    state,
  };
});

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => mockAxios.instance),
    post: mockAxios.post,
  },
}));

import { BASE_URL } from "./http.js";

function createRequestError(status = 401, config = {}) {
  return {
    config: {
      url: "/private",
      headers: {},
      ...config,
    },
    response: { status },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mockAxios.instance.mockResolvedValue({ data: { id: 1 } });
});

afterEach(() => {
  localStorage.clear();
});

describe("http", () => {
  it("BASE_URL은 환경변수 또는 기본 주소를 사용한다", () => {
    expect(BASE_URL).toBeDefined();
  });

  it("요청 interceptor가 accessToken을 Authorization 헤더에 추가한다", () => {
    localStorage.setItem("accessToken", "access-token");
    const config = { headers: {} };

    const result = mockAxios.state.requestHandler(config);

    expect(result).toBe(config);
    expect(config.headers.Authorization).toBe("Bearer access-token");
  });

  it("요청 interceptor는 accessToken이 없으면 요청 설정을 유지한다", () => {
    const config = { headers: {} };

    mockAxios.state.requestHandler(config);

    expect(config.headers).toEqual({});
  });

  it("401 응답 시 토큰을 재발급하고 원래 요청을 재시도한다", async () => {
    localStorage.setItem("accessToken", "old-token");
    mockAxios.post.mockResolvedValue({
      data: { data: { accessToken: "new-token" } },
    });
    mockAxios.instance.mockResolvedValue({ data: { id: 1 } });

    const error = createRequestError();
    const result = await mockAxios.state.responseErrorHandler(error);

    expect(result).toEqual({ data: { id: 1 } });
    expect(mockAxios.post).toHaveBeenCalledWith(
      `${BASE_URL}/users/token/refresh`,
      null,
      { withCredentials: true },
    );
    expect(mockAxios.instance).toHaveBeenCalledWith(
      expect.objectContaining({
        _retry: true,
        headers: expect.objectContaining({
          Authorization: "Bearer new-token",
        }),
      }),
    );
  });

  it("동시에 여러 요청이 401을 받아도 토큰 재발급은 한 번만 실행한다", async () => {
    let resolveRefresh;
    mockAxios.post.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRefresh = resolve;
        }),
    );
    mockAxios.instance.mockResolvedValue({ data: {} });

    const firstRequest = mockAxios.state.responseErrorHandler(
      createRequestError(401, { url: "/first" }),
    );
    const secondRequest = mockAxios.state.responseErrorHandler(
      createRequestError(401, { url: "/second" }),
    );

    expect(mockAxios.post).toHaveBeenCalledTimes(1);

    resolveRefresh({
      data: { data: { accessToken: "new-token" } },
    });

    await Promise.all([firstRequest, secondRequest]);
    expect(mockAxios.instance).toHaveBeenCalledTimes(2);
  });

  it("토큰 재발급에 실패하면 세션 만료 에러를 발생시킨다", async () => {
    mockAxios.post.mockRejectedValue(new Error("refresh failed"));

    await expect(
      mockAxios.state.responseErrorHandler(createRequestError()),
    ).rejects.toThrow("세션이 만료되었습니다.");
  });
});
