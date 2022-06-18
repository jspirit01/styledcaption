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
    max="1.0"
    step="0.001"
    />
    <p>value {{feature}}</p>

    <button type="button" @click="toneTest">TEST</button>
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
            voice: require("../assets/audio/sample4.mp3"),
            music: require("../assets/audio/sample4.mp3"),
            sfx: require("../assets/audio/sample4.mp3")
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

            const player = new Tone.Player(this.sfx).toDestination();
            Tone.loaded().then(() => {
                player.start();
            });
        }
    },
};

</script>