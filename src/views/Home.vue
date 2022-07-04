<template>
    <div>
        <h1>I am home</h1>
        <HelloWorld/>
        <av-waveform
            :audio-src="audio[0]">
        </av-waveform>
    <p>This is text</p>
    <p class="text">누가 감히</p>
    <button tyoe="button" @click="offlineTest">OFFLINE RENDERING</button>    
    <button class="play">RENDIERING Play</button>
    <canvas id="myChart" width="400" height="100"></canvas>

    </div>
        <button type=button @click="formant">FORMANT</button>
    
    <div id="canvas_div">
    <canvas id="SpectrumCanvas" width="1200" height="100" ></canvas>
  
</div>
</template>
<script>
import HelloWorld from '../components/HelloWorld.vue'
const FormantAnalyzer = require('formantanalyzer');
import Chart from 'chart.js/auto';
import SoundBuffer from '../Chunk.js'

export default {
    name: 'Home',
    data() {
        return{
            timeline: { 
                0: {'startTime': 0.0, 'endTime':1.0, 'caption':["I Had to write a lot of papers."]},
                1: {'startTime': 1.0, 'endTime':2.0, 'caption':["write a lot of papers."]},
                2: {'startTime': 2.0, 'endTime':2.5, 'caption':["a lot of papers."]}
            },
            audio: [require("../assets/audio/M_000001.wav")]
        }
    },
    components: {
        HelloWorld,
    },
    mounted() {
       //const AudioContext = window.AudioContext || window.webkitAudioContext;
       //this.audioContext = new AudioContext();
       //this.soundBuffer = new SoundBuffer();
    },
    methods : {
        offlineTest() {
            const sampleRate = 44100;
            let audioCtx = new AudioContext();
            let offlineCtx = new OfflineAudioContext(2,sampleRate*4,sampleRate);
            // let offlineCtx = new OfflineAudioContext(2);

            this.soundBuffer = new SoundBuffer(audioCtx, this.timeline, this.audio[0], sampleRate);
            //console.log(this.soundBuffer);
 
            const source = offlineCtx.createBufferSource();

            //const pre = document.querySelector('pre');
            // const myScript = document.querySelector('script');
            const play = document.querySelector('.play');
            // const stop = document.querySelector('.stop');

            function getData(audioURL, timeline, soundBuffer) {
                const request = new XMLHttpRequest();
                request.open('GET', audioURL, true);
                request.responseType = 'arraybuffer';

                request.onload = function() {
                    let audioData = request.response;
                    
                    audioCtx.decodeAudioData(audioData, function(buffer) {
                        source.buffer = buffer;
                        source.connect(offlineCtx.destination);
                        source.start();
                        //source.loop = true;
                        offlineCtx.startRendering().then(function(renderedBuffer) {
                            console.log('Rendering completed successfully');
                            
                            const audioArray = renderedBuffer.getChannelData(0)

                            // console.log("audioarray: ", audioArray)
                            // console.log("sample rate: ", renderedBuffer.sampleRate)
                            // console.log("length: ", audioArray.length)
                            // console.log("duration: ", audioArray.length / renderedBuffer.sampleRate)
                            
                            for (let i = 0, length = Object.keys(timeline).length; i < length; i++){
                                let startTime = timeline[i].startTime;
                                let endTime = timeline[i].endTime;

                                let data = audioArray.slice(startTime * sampleRate, endTime * sampleRate);
                                console.log("hi", data, startTime * sampleRate, endTime * sampleRate)
                                soundBuffer.log("chunk queued");
                                let chunk = soundBuffer.createChunk(data);
                                soundBuffer.chunks.push(chunk);
                            }
                            
                            console.log(soundBuffer.chunks);


                            //play chunk test
                            
                            // let song = audioCtx.createBufferSource);
                            // song.buffer = renderedBuffer;
                            //song.buffer = soundBuffer.chunks[0];

                            // song.connect(audioCtx.destination);

                            play.onclick = function() {
                                console.log(soundBuffer.chunks[0])
                                //soundBuffer.chunks[0].start();
                                //soundBuffer.chunks[1].start();
                                soundBuffer.chunks[2].start();
                                // song.start();
                            }
                        }).catch(function(err) {
                            console.log('Rendering failed: ' + err);
                            // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
                        });
                    });
                }

                request.send();
            }

            // Run getData to start the process off

            getData(this.audio[0], this.timeline, this.soundBuffer);
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

<style scoped>
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

.text {
        font-family: 'PyeongChangPeace-Bold';
}

</style>