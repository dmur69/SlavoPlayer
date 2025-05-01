// useAudio.js
import { Howl } from 'howler';

export function useAudio() {
  let sound = null;

  // Initialisiert den Audio-Track
  function init(trackUrl) {
    cleanup(); // Falls vorheriger Track existiert, bereinigen
    sound = new Howl({
      src: [trackUrl],
      html5: true,
    });
  }

  // Startet den Track
  function play() {
    if (sound) {
      sound.play();
    }
  }

  // Pausiert den Track
  function pause() {
    if (sound) {
      sound.pause();
    }
  }

  // Stoppt den Track
  function stop() {
    if (sound) {
      sound.stop();
    }
  }

  // Setzt die aktuelle Position des Tracks
  function seek(seconds) {
    if (sound) {
      sound.seek(seconds);
    }
  }

  // Fügt ein Event hinzu, das nur einmal ausgeführt wird
  function once(event, callback) {
    if (sound) {
      sound.once(event, callback);
    }
  }

  // Fügt ein Event hinzu, das bei jeder Auslösung ausgelöst wird
  function on(event, callback) {
    if (sound) {
      sound.on(event, callback);
    }
  }

  // Gibt zurück, ob der Track gerade abgespielt wird
  function playing() {
    return sound ? sound.playing() : false;
  }

  // Gibt die Dauer des Tracks zurück
  function duration() {
    return sound ? sound.duration() : 0;
  }

  // Gibt die aktuelle Position des Tracks zurück
  function currentSeek() {
    return sound ? sound.seek() : 0;
  }

  // Bereinigt den aktuellen Track
  function cleanup() {
    if (sound) {
      sound.unload();
      sound = null;
    }
  }

  return {
    sound,
    init,
    play,
    pause,
    stop,
    seek,
    on,
    once,
    playing,
    duration,
    currentSeek,
    cleanup,
  };
}
