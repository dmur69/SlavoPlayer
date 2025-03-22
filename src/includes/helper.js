export default {
  //  Return time formated like time value: 00:02
  formatSecToTimerValue(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60) || 0;
    const seconds = Math.round(timeInSeconds - minutes * 60 || 0);
    const secFomated = `${seconds < 10 ? "0" : ""}${seconds}`;
    const minFomated = `${minutes < 10 ? "0" : ""}${minutes}`;
    return `${minFomated}:${secFomated}`;
  },

  // Transform to seconds
  formatTimerValueToSec(timeValueString) {
    try {
      const minutes = parseInt(timeValueString.split(":")[0], 10);
      const seconds = parseInt(timeValueString.split(":")[1], 10);
      return minutes * 60 + seconds;
    } catch (error) {
      console.log("Error in formatTimerValueToSec");
      console.log(error);
      return 0;
    }
  },

  // Limits string :-)
  stringLimiter(str, count) {
    if (str.length < count) return str;
    const s = str.substring(0, count);
    return `${s}...`;
  }
};
