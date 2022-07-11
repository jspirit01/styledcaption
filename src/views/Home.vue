<template>
    <article>
        <!-- <audio src="" crossorigin="anonymous" ></audio> -->
        <button class="play-btn" @click="currenttime">mark current time log</button>
        
        
        <section class="container">
            <div class="audioPlayer">
  
            </div>
            
            <div id="caption-text" >CAPTION TEXT</div>
        </section>
<input
    type="range"
    id="levelRange"
    ref="levelRange"
    name="level"
    min="0.0"
    max="0.05"
    step="0.001"
    />
    
    </article>    

    <!-- <button type=button @click="formant">FORMANT</button> -->
    
    <!-- <canvas id="SpectrumCanvas" width="1200" height="100" ></canvas> -->

</template>
<script>
import HelloWorld from '../components/HelloWorld.vue'
const FormantAnalyzer = require('formantanalyzer');
import Chart from 'chart.js/auto';
import SoundBuffer from '../Chunk.js'
import Player from '../Player.js'
import captionJson from '../assets/caption/caption_styling.json'

export default {
    name: 'Home',
    data() {
        return{
            timeline: [
                { 
                    0: {'startTime': 0.0, 'endTime':2.09, 'caption':["우리 집이 잘 못 산다는 것을"]},
                    1: {'startTime': 2.09, 'endTime':3.6, 'caption':["친구들이 알게 되었을 때"]},
                    2: {'startTime': 5.0, 'endTime':6.87, 'caption':["무너지는 것 같았어"]}
                },
                { 
                    0: {'startTime': 0.0, 'endTime':1.0, 'caption':["우리 아빠는"]},
                    1: {'startTime': 1.6, 'endTime':2.0, 'caption':["나한테 제대로된 선물 한 번 준 적 없으셔."]},
                    
                },
                { 
                    0: {'startTime': 0.0, 'endTime':6.0, 'caption':["Which means I had to write a lot of papers."]},
                    // 1: {'startTime': 1.0, 'endTime':2.0, 'caption':["write a lot of papers."]},
                },
            ],
            audio: [
                require("../assets/audio/F_000001.wav"),
                require("../assets/audio/M_000001.wav"),
                require("../assets/audio/speech.mp3"),
                require("../assets/audio/Night_Driver.mp3"),
                require("../assets/audio/Opened_Eyes_Woke.mp3"),
                require("../assets/audio/The_Woogie.mp3")                
            ],
            captions: [
                captionJson
            ]
            ,
            // audio: {
            //     "Speech 1": require("../assets/audio/F_000001.wav"),
            //     "Speech 2": require("../assets/audio/M_000001.wav"),
            //     "Speech 3": require("../assets/audio/speech.mp3"),
            //     "Music 1": require("../assets/audio/Night_Driver.mp3"),
            //     "Music 2": require("../assets/audio/Opened_Eyes_Woke.mp3"),
            //     "Music 3": require("../assets/audio/The_Woogie.mp3")        
            // }
        }
    },
    components: {
        HelloWorld,
    },
    mounted() {
        // fetch("../assets/caption/caption_styling.json").then(response => {
        //     return response.json();
        // }).then(jsondata => console.log(jsondata))

        console.log(this.captions)
       //const AudioContext = window.AudioContext || window.webkitAudioContext;
       //this.audioContext = new AudioContext();
       //this.soundBuffer = new SoundBuffer();
        this.player = new Player('.audioPlayer', [
            { name: 'Speech 1', url: this.audio[0], timeline: this.captions[0]},
            // { name: 'Speech 2', url: this.audio[1], timeline: this.timeline[1]},
            // { name: 'Speech 3', url: this.audio[2], timeline: this.timeline[2]},
            // { name: 'Music 1', url: this.audio[3], timeline: this.timeline[0]},
            // { name: 'Music 2', url: this.audio[4], timeline: this.timeline[0]},
            // { name: 'Music 3', url: this.audio[5], timeline: this.timeline[0]},
        ]);
    },
    methods : {

        currenttime(){
            
            console.log("current time", this.player.audioElem.currentTime);

           
            
        },
        formant() {
            function Configure_FormantAnalyzer()
            {
                const BOX_HEIGHT = 300;
                const BOX_WIDTH = window.screen.availWidth - 50;
                document.getElementById('SpectrumCanvas').width = BOX_WIDTH;    //reset the size of canvas element
                document.getElementById('SpectrumCanvas').height = BOX_HEIGHT;
                
                let launch_config = { plot_enable: true,
                spec_type: 1,       //see below
                output_level: 2, //see below
                plot_len: 200, f_min: 50, f_max: 4000,
                N_fft_bins: 256,
                N_mel_bins: 128,
                window_width: 25, window_step: 15,
                pause_length: 200, min_seg_length: 50,
                auto_noise_gate: true, voiced_min_dB: 10, voiced_max_dB: 100,
                plot_lag: 1, pre_norm_gain: 1000, high_f_emph: 0.0,
                plot_canvas: document.querySelector('#SpectrumCanvas').getContext('2d'),
                canvas_width: BOX_WIDTH,
                canvas_height: BOX_HEIGHT };

                FormantAnalyzer.configure(launch_config);
            }
            Configure_FormantAnalyzer();





            const audioContext = new AudioContext();
            const htmlAudioElement = new Audio(this.voice);
            htmlAudioElement.play();

            const source = audioContext.createMediaElementSource(htmlAudioElement);
            source.connect(audioContext.destination);


            const context_source = 2;   //1: Local file binary, 2: play from a web Audio, 3: mic
            const test_mode = true; //plots only, it does not return callback
            const offline = false;  //play on speakers, set true to play silently
            const file_labels =[];     //array of labels that will be passed to callback after feature extraction

            FormantAnalyzer.LaunchAudioNodes(context_source, htmlAudioElement,
                                callback, file_labels, offline, test_mode).then(function()
                    {
                        console.log("Done");
                    }).catch((err)=>{
                        console.log(err);
                        console.log("ERROR")
                    });


            // var webAudioElement = new Audio(this.music);
            // /*Parameters:*/
            // const context_source = 2;   //1: Local file binary, 2: play from a web Audio, 3: mic
            // const test_mode = true; //plots only, it does not return callback
            // const offline = false;  //play on speakers, set true to play silently
            // const file_labels =[];     //array of labels that will be passed to callback after feature extraction

            // /* Wait for audio file to load */
            // webAudioElement.addEventListener("canplaythrough", event => {
            //     /* Launch Audio Nodes */
            //     FormantAnalyzer.LaunchAudioNodes(context_source, webAudioElement,
            //                     callback, file_labels, offline, test_mode).then(function()
            //         {
            //             console.log("Done");
            //         }).catch((err)=>{
            //             console.log(err);
            //             console.log("ERROR")
            //         });
            // });

            async function callback(seg_index, seg_label, seg_time, features)
            {
                if(launch_config.output_level == 13) //Syllable 53x statistical features for each segment
                {
                    if(settings.collect)
                    for(let segment = 0; segment < features.length; segment++ ) 
                    {
                        storage_mod.StoreFeatures(launch_config.output_level, settings.DB_ID, (seg_index + (segment/100)), seg_label, seg_time[segment], features[segment]);
                        console.log(features);
                    }
                    
                    if(settings.plot_enable && settings.predict_en)
                    {
                        pred_mod.predict_by_multiple_syllables(settings.predict_type, settings.predict_label, seg_index, features, seg_time);
                    }
                }
            }                                                                  
        }
    }   
    
};

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap');
@import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';

#app {
    background-color: black;
}
p {
    display:inline-block;
    transform: scale(1,1);
    font-family: 'PyeongChangPeace-Bold';
/* -webkit-transform:scale(1,1); Safari and Chrome */
/* -moz-transform:scale(2,3); Firefox */
/* -ms-transform:scale(2,3); IE 9 */
/* -o-transform:scale(2,3); Opera */
/* Rest Of CSS Code Here */
}

@font-face {
    font-family: 'PyeongChangPeace-Bold';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-  02@1.0/PyeongChangPeace-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
}

article {
    display: block;
    align-items: center;
}

.container {
    display: block;
    align-items: center;
}

.text {
    font-family: 'PyeongChangPeace-Bold';
}


.video-container {
    width: 900px;
    background-color: gold;
    display: flex;
    align-items: center;
}

video {
    width: 100%;
    height: 0;
    padding-top: 56.25%;
    background-color: rgb(59, 87, 71);
}

.audioPlayer {
    box-shadow: 0 0 32px 4px rgba(0,0,0,0.2);
    font-family: 'Source Sans Pro', sans-serif;
    width: fit-content;
    display: flex;

    .playlist {
        background: rgba(255, 0, 0, 0);
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
#caption-text {
    font-size: 20px;
    color: white;
}
</style>