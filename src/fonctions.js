import * as cookie from "js-cookie";

const JOUR = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
];
const MOIS = [
    "january",
    "febuary",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
];
export const themeName = "darkTheme";
export function checkDevice() {
    return /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);
}
export function saveVoterData(name, data) {
    if (!cookie.get("voter")) return;
    if (!cookie.get(cookie.get("voter"))) return;
    const voter = JSON.parse(cookie.get(cookie.get("voter")));
    voter[name] = data;

    cookie.set(cookie.get("voter"), JSON.stringify(voter));
}
export function getVoterData(name) {
    if (!cookie.get("voter")) return "";
    if (!cookie.get(cookie.get("voter"))) return "";
    const voter = JSON.parse(cookie.get(cookie.get("voter")));
    if (voter) {
        if (typeof voter[name] !== "undefined") {
            let a = "";
            try {
                a = JSON.parse(voter[name]);
            } catch (e) {
                a = voter[name];
            }
            return a;
        }
    }
    return "";
}
export function getDateformate(v) {
    if (typeof v == "string") v = new Date(v);
    return v.getFullYear() + "-" + v.getMonth() + "-" + v.getDate();
}
function formate(a) {
    if (a < 10) {
        return `0${a}`;
    }
    return a;
}
export function mode_exact(convert) {
    const thatDayC = new Date();
    const date = new Date(convert);
    let r;
    const thatYear = thatDayC.getFullYear();
    const thatMonth = thatDayC.getMonth();
    const thatDate = thatDayC.getDate();
    let thatDay = thatDayC.getDay();
    const curY = date.getFullYear();
    const curM = date.getMonth();
    const curDate = date.getDate();
    let curDay = date.getDay();
    if (thatYear == curY) {
        if (thatMonth == curM) {
            if (thatDate == curDate) {
                const m = date.getMinutes();
                r = `${formate(date.getHours())}:${formate(m)}`;
            } else if (thatDate - curDate < 7) {
                if (thatDate - curDate == 1) {
                    r = "Yesterday";
                } else {
                    curDay = curDay == 0 ? 7 : curDay;
                    thatDay = thatDay == 0 ? 7 : thatDay;
                    if (thatDay >= curDay) {
                        r = JOUR[curDay % 7];
                    } else {
                        r = `${curDate}, ${MOIS[curM % 12]}`;
                    }
                }
            } else {
                r = `${curDate}, ${MOIS[curM % 12]}`;
            }
        } else {
            r = `${curDate}, ${MOIS[curM % 12]}`;
        }
    } else {
        r = `${formate(curDay)}/${formate(curM)}/${curY}`;
    }
    return r;
}

export function mode_exact2(convert) {
    const thatDayC = new Date();
    const date = new Date(convert);
    let r;
    const thatYear = thatDayC.getFullYear();
    const thatMonth = thatDayC.getMonth();
    const thatDate = thatDayC.getDate();
    let thatDay = thatDayC.getDay();
    const curY = date.getFullYear();
    const curM = date.getMonth();
    const curDate = date.getDate();
    let curDay = date.getDay();
    const m = date.getMinutes();
    if (thatYear == curY) {
        if (thatMonth == curM) {
            if (thatDate == curDate) {
                r = `${formate(date.getHours())}:${formate(m)}`;
            } else if (thatDate - curDate < 7) {
                if (thatDate - curDate == 1) {
                    r = `Yesterday at ${formate(date.getHours())}:${formate(
                        m
                    )}`;
                } else {
                    curDay = curDay == 0 ? 7 : curDay;
                    thatDay = thatDay == 0 ? 7 : thatDay;
                    if (thatDay >= curDay) {
                        r = `${JOUR[curDay % 7]} at ${formate(
                            date.getHours()
                        )}:${formate(m)}`;
                    } else {
                        r = `${curDate}, ${MOIS[curM % 12]} at ${formate(
                            date.getHours()
                        )}:${formate(m)}`;
                    }
                }
            } else {
                r = `${curDate}, ${MOIS[curM % 12]} at ${formate(
                    date.getHours()
                )}:${formate(m)}`;
            }
        } else {
            r = `${curDate}, ${MOIS[curM % 12]} at ${formate(
                date.getHours()
            )}:${formate(m)}`;
        }
    } else {
        r = `${formate(curDay)}/${formate(curM)}/${curY} at ${formate(
            date.getHours()
        )}:${formate(m)}`;
    }
    return r;
}
