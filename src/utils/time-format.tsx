import moment from "moment";

moment.locale("id");
type format = "HH:mm" | "HH:mm:ss" | "HH:mm:ss.SSS" | "HH:mm:ss.SSSSSS" | "DD MMMM yyyy";

export const formatTime = (time: string, format: format) => moment(time).format(format);
