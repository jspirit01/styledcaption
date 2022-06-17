<template>
    <div>
        <h1>I am sound.</h1>
    </div>
    <button type="button" @click="getFeatures" id="btn-analyze">ANALYZE</button>
    <br>
    <audio
        controls
        loop
        crossorigin="anonymous"
        id="audio"
        ref="audio"
        src="https://cdn.glitch.com/184ed7fc-13aa-4fdc-98ca-8683b9a5d877%2F9579__tictacshutup__sold-break-8-bars.wav?1537042752804"
    ></audio>
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
    <p>{{feature}}</p>
    
</template>   
<script>
import * as Meyda from 'meyda'

export default {
    data() {
        return{
            feature: 111,
        }
    },

    methods: {
        getFeatures() {
            const audioContext = new AudioContext();
            // Select the Audio Element from the DOM
            const htmlAudioElement = this.$refs.audio;
            // Create an "Audio Node" from the Audio Element
            const source = audioContext.createMediaElementSource(htmlAudioElement);
            // Connect the Audio Node to your speakers. Now that the audio lives in the
            // Audio Context, you have to explicitly connect it to the speakers in order to
            // hear it
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
    },
};

</script>