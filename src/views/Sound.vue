<template>
    <div>
        <h1>I am sound.</h1>
    </div>
    <div>
    <button type="button" @click="playVoice">Voice</button>     <p>value {{feature1}}</p>
    </div>
    <div>
    <button type="button" @click="playMusic">Music</button>     <p>value {{feature2}}</p>
    </div>
    <div>
    <button type="button" @click="playSFX">SFX</button>    <p>value {{feature3}}</p>
    </div>
    <br>
    
    <!-- <audio
        controls
        loop
        crossorigin="anonymous"
        id="audio"
        ref="audio"
        src="https://cdn.glitch.com/184ed7fc-13aa-4fdc-98ca-8683b9a5d877%2F9579__tictacshutup__sold-break-8-bars.wav?1537042752804"
    >
    </audio> -->
    <br>
    <label for="level">level</label>
    <input
    type="range"
    id="levelRange"
    ref="levelRange"
    name="level"
    min="0.0"
    max="0.5"
    step="0.01"
    />
    <p>value {{feature}}</p>

    <button type="button" @click="toneTest">TEST1</button>

    <button type="button" @click="toneTest2">TEST2</button>
    <br>
    <div border="1" border-color="black">
    <canvas class="visualizer" width="500" height="300"></canvas>
    </div>
    <Tone/>
    
</template>
<script>
import * as Meyda from 'meyda'
import * as Tone from 'tone'


export default {

    data() {
        return{
            feature1: 111,
            feature2: 111,
            feature3: 111,
            voice: require("../assets/audio/F_000001.wav"),
            music: require("../assets/audio/classic.mp3"),
            sfx: require("../assets/audio/classic.mp3")
        }
    },
    methods: {
        playVoice(){
            const audioContext = new AudioContext();
            const htmlAudioElement = new Audio(this.voice);
            htmlAudioElement.play();

            const source = audioContext.createMediaElementSource(htmlAudioElement);
            source.connect(audioContext.destination);

            const levelRangeElement = this.$refs.levelRange;
            const featureArray = [];
            console.log("analyze start");
            if (typeof Meyda === "undefined") {
                console.log("Meyda could not be found! Have you included it?");
            } else {
                

                const analyzer = Meyda.createMeydaAnalyzer({
                audioContext: audioContext,
                source: source,
                bufferSize: 512,
                featureExtractors: ["rms"],
                callback: (features) => {
                    console.log("rms", features.rms);
                    levelRangeElement.value = features.rms;

                    this.feature = features.rms;
                    featureArray.push(features.rms);
                    
                    const result = featureArray.reduce(function add(sum, currValue) {
                        return sum + currValue;
                    }, 0);
                    const average = result / featureArray.length;
                    console.log("AVERAGE: ", average)
                },
                });
                analyzer.start();
            }
            
        },
        playMusic(){
            const audioContext = new AudioContext();

            const htmlAudioElement = new Audio(this.music);
            htmlAudioElement.play();
            const source = audioContext.createMediaElementSource(htmlAudioElement);
            source.connect(audioContext.destination);

            const levelRangeElement = this.$refs.levelRange;

            console.log("analyze start");
            if (typeof Meyda === "undefined") {
                console.log("Meyda could not be found! Have you included it?");
            } else {
                const analyzer = Meyda.createMeydaAnalyzer({
                audioContext: audioContext,
                source: source,
                bufferSize: 512,
                featureExtractors: ["rms"],
                callback: (features) => {
                    console.log(features.rms);
                    levelRangeElement.value = features.rms;
                    this.feature = features.rms;
                },
                });
                analyzer.start();
            }
        },
        playSFX(){
            const audioContext = new AudioContext();

            const htmlAudioElement = new Audio(this.sfx);
            htmlAudioElement.play();
            const source = audioContext.createMediaElementSource(htmlAudioElement);
            source.connect(audioContext.destination);

            const levelRangeElement = this.$refs.levelRange;

            console.log("analyze start");
            if (typeof Meyda === "undefined") {
                console.log("Meyda could not be found! Have you included it?");
            } else {
                const analyzer = Meyda.createMeydaAnalyzer({
                audioContext: audioContext,
                source: source,
                bufferSize: 512,
                featureExtractors: ["rms"],
                callback: (features) => {
                    console.log(features.rms);
                    levelRangeElement.value = features.rms;
                    this.feature = features.rms;
                },
                });
                analyzer.start();
            }
        },

        toneTest() {
            //create a synth and connect it to the main output (your speakers)           

            // const player = new Tone.Player(this.sfx).toDestination();
            // Tone.loaded().then(() => {
            //     player.start();
            // });

            var canvas = document.querySelector('.visualizer');
            var canvasCtx = canvas.getContext("2d");



            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var analyser = audioCtx.createAnalyser();

            const htmlAudioElement = new Audio(this.sfx);
            htmlAudioElement.play();
            const source = audioCtx.createMediaElementSource(htmlAudioElement);
            const distortion = audioCtx.createWaveShaper();
            source.connect(analyser);
            analyser.connect(distortion);
            distortion.connect(audioCtx.destination);

            analyser.fftSize = 2048;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);
            
            var draw = function() {

                
                requestAnimationFrame(draw);
                analyser.getByteTimeDomainData(dataArray);
                console.log(dataArray);

                canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);                

                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
                canvasCtx.beginPath();

                var sliceWidth = canvas.width * 1.0 / bufferLength;
                var x = 0;
                for(var i = 0; i < bufferLength; i++) {

                    var v = dataArray[i] / 128.0;
                    var y = v * canvas.height/2;

                    if(i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(canvas.width, canvas.height/2);
                canvasCtx.stroke();
            };
            
            draw();
        },
        toneTest2() {
            //create a synth and connect it to the main output (your speakers)           

            // const player = new Tone.Player(this.sfx).toDestination();
            // Tone.loaded().then(() => {
            //     player.start();
            // });

            var canvas = document.querySelector('.visualizer');
            var canvasCtx = canvas.getContext("2d");



            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var analyser = audioCtx.createAnalyser();

            const htmlAudioElement = new Audio(this.voice);
            htmlAudioElement.play();
            const source = audioCtx.createMediaElementSource(htmlAudioElement);
            const distortion = audioCtx.createWaveShaper();
            source.connect(analyser);
            analyser.connect(distortion);
            distortion.connect(audioCtx.destination);

            analyser.fftSize = 256;
            var bufferLength = analyser.frequencyBinCount;
            console.log(bufferLength);
            var dataArray = new Uint8Array(bufferLength);

// canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            
            var draw = function() {

                
                requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);           // frequency data 추출
                console.log(dataArray);

                canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);                

                var barWidth = (canvas.width / bufferLength) * 2.5;
                var barHeight;
                var x = 0;


                for(var i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i]/2;

                    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                    canvasCtx.fillRect(x, canvas.height-barHeight/2, barWidth, barHeight/2);

                    x += barWidth + 1;
                }
            };
            
            draw();

        },

    },
};

</script>