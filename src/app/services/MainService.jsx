import createAxiosInstance from "@/app/axios/http-common";

const getMagicLink = () => {
  return createAxiosInstance().post("user/send/magic-link");
};

const checkMagicLink = (token) => {
  return createAxiosInstance().post(`user/check/magic-link?token=${token}`);
};

const sendMailAboutService = (reqMail) => {
  return createAxiosInstance().post(`user/service/mail`, reqMail, {})
}

export default {
  getMagicLink,
  checkMagicLink,
  sendMailAboutService
};

