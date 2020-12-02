import {getRandomInteger} from "./common-tools.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


export const generateRecordDay = () => {
  const daysAgo = getRandomInteger(0, 14);

  if (daysAgo <= 7 && !!daysAgo) {
    return dayjs().subtract(daysAgo, `day`).fromNow();
  }

  return daysAgo ? dayjs().subtract(daysAgo, `day`).format(`YYYY/MM/DD HH:mm`) : `today`;
};
