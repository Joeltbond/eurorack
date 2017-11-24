let ctx;
let oscId = 0;
const oscillators = {};

export const createAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  ctx = new AudioContext();
};

export const createOscillator = () => {
  const id = oscId++;
  oscillators[id] = ctx.createOscillator();
  return id;
};
