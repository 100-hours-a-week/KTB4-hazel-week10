import { queryOptions } from "@tanstack/react-query";

import {
  getDiscordAuthorizeUrlRequest,
  getMyInfoRequest,
  getNotificationSettingsRequest,
} from "../api/userApi.js";

const userQueries = {
  allKeys: () => ["users"],

  meKeys: () => [...userQueries.allKeys(), "me"],
  me: () =>
    queryOptions({
      queryKey: userQueries.meKeys(),
      queryFn: getMyInfoRequest,
    }),

  notificationSettingsKeys: () => [
    ...userQueries.meKeys(),
    "notification-settings",
  ],
  notificationSettings: () =>
    queryOptions({
      queryKey: userQueries.notificationSettingsKeys(),
      queryFn: getNotificationSettingsRequest,
    }),

  discordAuthorizeUrlKeys: () => [
    ...userQueries.meKeys(),
    "discord-authorize-url",
  ],
  discordAuthorizeUrl: () =>
    queryOptions({
      queryKey: userQueries.discordAuthorizeUrlKeys(),
      queryFn: getDiscordAuthorizeUrlRequest,
    }),
};

export default userQueries;
