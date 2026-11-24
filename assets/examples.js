'use strict';

const overview = document.getElementById('overview');
for (const cue of document.querySelectorAll('[data-time]')) {
  cue.addEventListener('click', () => {
    overview.currentTime = Number(cue.dataset.time);
    overview.play().catch(() => {});
  });
}

const clip = document.getElementById("clip");
const form = document.getElementById("comparison");
let pendingClip = null;

form.addEventListener("change", () => {
  const instrument = form.elements.instrument.value;
  form.elements.component.disabled = instrument === "mix";
  const suffix = instrument === "mix" ? "" : "_" + instrument + "_" + form.elements.component.value;
  const file = form.elements.listener.value + "_" + form.elements.panel.value + suffix + ".mp4";
  const url = new URL("assets/concert_occlusion/" + file, document.baseURI).href;
  if (url === clip.src) return;
  const time = pendingClip ? pendingClip.time : clip.currentTime;
  const playing = pendingClip ? pendingClip.playing : !clip.paused && !clip.ended;
  pendingClip = {url, time, playing};
  clip.src = url;
});

clip.addEventListener("loadedmetadata", () => {
  if (!pendingClip || pendingClip.url !== clip.currentSrc) return;
  const {time, playing} = pendingClip;
  pendingClip = null;
  clip.currentTime = Math.min(time, clip.duration);
  if (playing) clip.play().catch(() => {});
});

const recordings = document.querySelectorAll('audio, video');
for (const recording of recordings) {
  recording.addEventListener('play', () => {
    if (recording !== clip && pendingClip) pendingClip.playing = false;
    for (const other of recordings) {
      if (other !== recording && !other.paused) other.pause();
    }
  });
}

const viewer = document.getElementById('image-viewer');
const fullImage = document.getElementById('enlarged-image');
const caption = document.getElementById('image-caption');
for (const button of document.querySelectorAll('.enlarge')) {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    fullImage.src = image.src;
    fullImage.alt = image.alt;
    caption.textContent = image.alt;
    viewer.showModal();
  });
}
viewer.addEventListener('click', event => {
  if (event.target === viewer) viewer.close();
});
