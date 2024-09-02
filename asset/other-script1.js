const playlist = [
    'music/votinh.mp3',
    'music/8d.mp3',
    'music/votinh.mp3',
    'music/khuongmatdangthuong.mp3'
];

const audio = document.querySelector("#audio");
const visualizer = document.querySelector("#visualizer");
let audioPlayed = false;
let currentTrackIndex = 0;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function playAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(startPlayback);
    } else {
        startPlayback();
    }
}

function startPlayback() {
    if (!audioPlayed) {
        audio.volume = 1.0;
        audio.src = playlist[currentTrackIndex];
        audio.play().then(() => {
            audioPlayed = true;
        }).catch(error => {
            console.error("Error playing audio:", error);
        });
    }
}

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    audio.src = playlist[currentTrackIndex];
    audio.play();
}

function updateVisualizer() {
    analyser.getByteFrequencyData(dataArray);

    let bassSum = 0;
    const bassRange = 8;
    for (let i = 0; i < bassRange; i++) {
        bassSum += dataArray[i];
    }
    const bassAverage = bassSum / bassRange;

    const visualizerWidth = (bassAverage / 255) * 100;
    visualizer.style.width = visualizerWidth + '%';

    const maxBassValue = 255;
    const percentage = bassAverage / maxBassValue;

    const startColor = [0, 255, 0];
    const middleColor = [255, 255, 0];
    const endColor = [255, 0, 0];

    let red, green, blue;

    if (percentage < 0.5) {
        const ratio = percentage * 2;
        red = Math.round(startColor[0] * (1 - ratio) + middleColor[0] * ratio);
        green = Math.round(startColor[1] * (1 - ratio) + middleColor[1] * ratio);
        blue = Math.round(startColor[2] * (1 - ratio) + middleColor[2] * ratio);
    } else {
        const ratio = (percentage - 0.5) * 2;
        red = Math.round(middleColor[0] * (1 - ratio) + endColor[0] * ratio);
        green = Math.round(middleColor[1] * (1 - ratio) + endColor[1] * ratio);
        blue = Math.round(middleColor[2] * (1 - ratio) + endColor[2] * ratio);
    }

    visualizer.style.background = `linear-gradient(to right, rgb(${startColor[0]}, ${startColor[1]}, ${startColor[2]}) ${percentage * 100}%, rgb(${red}, ${green}, ${blue}))`;

    requestAnimationFrame(updateVisualizer);
}

document.addEventListener("click", playAudio);
audio.addEventListener("ended", playNextTrack);
updateVisualizer();
