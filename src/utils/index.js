function paddingLeftZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

export const getNowTimeStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = paddingLeftZero(now.getMonth() + 1);
    const date = paddingLeftZero(now.getDate());
    const hour = paddingLeftZero(now.getHours());
    const minute = paddingLeftZero(now.getMinutes());
    const second = paddingLeftZero(now.getSeconds());

    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};
