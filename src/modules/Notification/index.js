import { prisma } from "../../lib/prisma.js";
import {Expo} from 'expo-server-sdk'
const expo = new Expo();

export default {
  async getNotificationTokenByUserId(user_id) {
    try {
      const notificationToken = prisma.user.findUnique({
        where: {
          id: user_id,
        },
        select: {
          notificationToken: true,
        },
      });
      return notificationToken;
    } catch (error) {
      console.log("Não foi possivel obter o token");
    }
  },

  async sendPushNotification(token, message) {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not valid!`);
      return;
    }

    const notifications = [
      {
        to: token,
        sound: "default",
        body: message,
        data: { message },
      },
    ];

    const chunks = expo.chunkPushNotifications(notifications);
    for (let chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  },
};
