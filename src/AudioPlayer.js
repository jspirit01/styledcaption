export default class AudioPlayer {
    constructor(selector = '.audioPlayer', audio = []) {
        this.playerElem = document.querySelector(selector);
        this.audio = audio;
        this.currentAudio = null;
        this.createPlayerElements();
        this.audioContext = null;
        this.render = null;
        this.meydaAnalyser = null;
    }

    createVisualiser() {
        // Analyzer 구현하기

        const canvas = this.visualiserElem;
        const ctx = canvas.getContext('2d');
        const levelRangeElement = document.querySelector("input");

        this.audioContext = new AudioContext();
        this.src = this.audioContext.createMediaElementSource(this.audioElem);
        const analyser = this.audioContext.createAnalyser();
        this.meydaAnalyser = Meyda.createMeydaAnalyzer({
            audioContext: this.audioContext,
            source: this.src,
            bufferSize: 512,
            featureExtractors: ["rms"],
            callback: (features) => {
                levelRangeElement.value = features.rms;
                this.feature = features.rms;
            },
            });
        

        this.src.connect(analyser);
        analyser.connect(this.audioContext.destination);

        analyser.fftSize = 128;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        var freqByteData = new Uint8Array(analyser.fftSize/2);
        var timeByteData = new Uint8Array(analyser.fftSize/2);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let bar;
        
        // const audioelem = this.audioElem;
        function renderFrame() {
            requestAnimationFrame(renderFrame);
            // if (audioaudioelem.paused) {
            //     cancelAnimationFrame(id)
            //   }
            bar = 0;
            
            var k = analyser.getByteFrequencyData(dataArray);

            analyser.getByteFrequencyData(freqByteData);
            analyser.getByteTimeDomainData(timeByteData);// array of all 1024 levels
            var data = {f:freqByteData, t:timeByteData}
            //var data = getDataFromAudio(freqByteData, timeByteData); // {f:array, t:array}
            console.log(freqByteData, timeByteData);                         // stream data value
      
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
      
            // var waveSum = 0;
            // for (let i = 0; i<data.f.length; i++) {
            //     ctx.fillStyle="blue";
            //     ctx.fillRect(i, canvas.height, 1, -data.f[i]);
            //     waveSum += data.f[i]; //add current bar value (max 255)
            //   }
              
            for (let i = 0; i < bufferLength; i++) {
              barHeight = data.f[i] - 75;
              const r = barHeight + (25 * (i/bufferLength));
              ctx.fillStyle = `rgb(${r}, 100, 50)`;
              ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
              bar += barWidth + 2;
            }
            for (let i = 0; i<data.t.length; i++) {
                ctx.fillStyle="red";
                ctx.fillRect(i*5, data.t[i], 1, 1);
              }
            // for (let i = 0; i < bufferLength; i++) {
            //     barHeight = data.t[i] - 75;
            //     const r = barHeight + (25 * (i/bufferLength));
            //     //ctx.fillStyle = `rgb(${r}, 100, 50)`;
            //     ctx.fillStyle = "red";
            //     ctx.fillRect(bar*2, canvas.height - barHeight, barWidth, barHeight);
            //     bar += barWidth + 2;
            //   }
        }

        renderFrame();
        this.meydaAnalyser.start()
    }

    createPlayerElements() {
        this.inputElem = document.createElement('input');
        this.audioElem = document.createElement('audio');
        const playListElem = document.createElement('div');
        playListElem.classList.add('playlist');
        const playElem = document.createElement('button');
        playElem.classList.add('play');
        playElem.innerHTML = '<i class="fa fa-play"></i>';
        this.visualiserElem = document.createElement('canvas');
        this.playerElem.appendChild(this.audioElem);
        this.playerElem.appendChild(playListElem);
        this.playerElem.appendChild(this.visualiserElem);

        this.createPlayListElements(playListElem);
    }

    createPlayListElements(playListElem) {
        this.audio.forEach(audio => {
            const audioItem = document.createElement('a');
            audioItem.href = audio.url;
            audioItem.innerHTML = `<i class="fa fa-play"></i>${audio.name}`;
            this.setEventListener(audioItem);
            playListElem.appendChild(audioItem);
        });
    }

    setEventListener(audioItem) {
        audioItem.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.audioContext) {
                this.createVisualiser();
            }
            const isCurrentAudio = audioItem.getAttribute('href') == (this.currentAudio && this.currentAudio.getAttribute('href'));

            if (isCurrentAudio && !this.audioElem.paused) {
                this.setPlayIcon(this.currentAudio);
                this.audioElem.pause();
            } else if (isCurrentAudio && this.audioElem.paused) {
                this.setPauseIcon(this.currentAudio);
                this.audioElem.play();
            } else {
                if (this.currentAudio) {
                    this.setPlayIcon(this.currentAudio);
                }
                this.currentAudio = audioItem;
                this.setPauseIcon(this.currentAudio);
                this.audioElem.src = this.currentAudio.getAttribute('href');
                this.audioElem.play();
            }

        })
    }

    setPauseIcon(elem) {
        const icon = elem.querySelector('i');
        icon.classList.add('fa-pause');
        icon.classList.remove('fa-play');
    }

    setPlayIcon(elem) {
        const icon = elem.querySelector('i');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    };
}