export const timeConverter = (time: number): string => {
    let hours = 0;
    let minutes = 0;
    let result = '';
    if (time >= 3600) {
      hours = Math.floor(time / 3600);
      time = Math.floor(time % 3600);
      result = result + hours + ':';
    }
    minutes = Math.floor(time / 60);
    time = Math.floor(time % 60);
    result =
      result + (minutes < 10 && hours > 0 ? '0' + minutes : minutes) + ':';
    return result + (time < 10 ? '0' + time : time);
}
