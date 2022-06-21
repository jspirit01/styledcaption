<template>

    <h1>I am about</h1>

    <div class="audioPlayer"></div>

    <input
    type="range"
    id="levelRange"
    ref="levelRange"
    name="level"
    min="0.0"
    max="1.0"
    step="0.001"
    />

</template>
<script>

import AudioPlayer from '../AudioPlayer';


export default {
    name: "About",
    data() {
        return{
            music: [
                require("../assets/audio/OvO.mp3"),
                require("../assets/audio/Regrets.mp3"),
                require("../assets/audio/Night_Driver.mp3"),
                require("../assets/audio/Opened_Eyes_Woke.mp3"),
                require("../assets/audio/The_Woogie.mp3"),
                require("../assets/audio/sample4.mp3"),
            ]
        }
    },
    mounted() {
       //const AudioContext = window.AudioContext || window.webkitAudioContext;
       //this.audioContext = new AudioContext();
       this.player = new AudioPlayer('.audioPlayer', [
        { name: 'OvO', url: this.music[0] },
        { name: 'Regrets', url: this.music[1] },
        { name: 'Night Driver', url: this.music[2] },
        { name: 'Opened Eyes Woke', url: this.music[3] },
        { name: 'The Woogie', url: this.music[4] },
        { name: 'Sample4', url: this.music[5] },
    ]);
    },
    methods : {
    
    }
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap');
@import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';

html, body {
    height: 100%;
}
body {
     align-items: center;
     justify-content: center;
}

.audioPlayer {
    box-shadow: 0 0 32px 4px rgba(0,0,0,0.2);
    font-family: 'Source Sans Pro', sans-serif;
    width: 600px;
    display: flex;

    canvas {
        flex: 2;
        width: 100%;
        background-color: black;
    }

    .playlist {
        background: rgba(85, 47, 47, 0);
        display: flex;
        flex-direction: column;
        a {
            i { 
                font-size: .75rem;
                margin-right: .5rem;
            }
            &:hover {
                background-color: rgb(49, 44, 44);
                color: rgb(255, 255, 255);
            }
            padding: .75rem 2.5rem;
            display: flex;
            align-items: center;
            width: 100%;
            color: rgb(194, 33, 33);
            text-decoration: none;
        }
    }
}

</style>