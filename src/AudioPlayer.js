import * as Pitchfinder from 'pitchfinder'
import { Gain, Waveform } from 'tone'
import * as Tone from 'tone'
import { Pitch } from './Pitch'
import Meyda from 'meyda';

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

    offlineTest(){
        let audioCtx = new AudioContext();
        let offlineCtx = new OfflineAudioContext(2,44100*40,44100);

        const source = offlineCtx.createBufferSource();
        //console.log(this.audio[0].url);
        // define constants for dom nodes

        // const pre = document.querySelector('pre');
        // const myScript = document.querySelector('script');
        const play = document.querySelector('.play');
        // const stop = document.querySelector('.stop');

        // use XHR to load an audio track, and
        // decodeAudioData to decode it and stick it in a buffer.
        // Then we put the buffer into the source

        function getData(audioURL) {
            const request = new XMLHttpRequest();

            request.open('GET', audioURL, true);

            request.responseType = 'arraybuffer';


            request.onload = function() {
                let audioData = request.response;

                audioCtx.decodeAudioData(audioData, function(buffer) {
                    source.buffer = buffer;
                    var analyser = offlineCtx.createAnalyser();
                    source.connect(analyser);
                    analyser.connect(offlineCtx.destination);

                    this.meydaAnalyser = Meyda.createMeydaAnalyzer({
                        audioContext: offlineCtx,
                        source: source,
                        bufferSize: 512,
                        featureExtractors: ["chroma"],
                        callback: (features) => {
                    
                        },
                        });
                    this.meydaAnalyser.start()
                    source.start();

                    //source.loop = true;
                    offlineCtx.startRendering().then(function(renderedBuffer) {
                        console.log('Rendering completed successfully');
                        // const channelData = renderedBuffer.getChannelData(0);
                    
                        // console.log("Data length "+ channelData.length.toString());
                        // console.log(data);
                        // // console.log("Data length "+ renderedBuffer.duration);
                        // // for (let i = 0, length = data.length; i < length; i += 1) {
                    
                        // //   // careful here, as you can hang the browser by logging this data
                        // //   // because 1 second of audio contains 22k ~ 96k samples!
                        // //   if (!(i % 1000) && i < 25000) console.log(i + " " + data[i]);
                        // // }  
                        // console.log(Meyda.extract("rms", renderedBuffer));

                        let song = audioCtx.createBufferSource();
                        song.buffer = renderedBuffer;
                        var songAnalyzer = audioCtx.createAnalyser();
                        song.connect(songAnalyzer);
                        songAnalyzer.connect(audioCtx.destination);

                        play.onclick = function() {

                         


                            // var frequencyBins = new Uint8Array(128);
                            
                            // console.log(frequencyBins);
                            // // You can also get the result of any filtering or any other stage here:

                            // function renderFrame() {
                            //     requestAnimationFrame(renderFrame);
                            //     songAnalyzer.getByteFrequencyData(frequencyBins);
                            //     console.log(frequencyBins);                         // stream data value
                            // }

                            // renderFrame();                       
                            song.start();
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

        getData(this.audio[1].url);


        // playSegment(this.audioElem, 1.11, 2.45); // this will play from 1.11 sec to 2.45 sec

        // function playSegment(audioObj, start, stop){
        //     let audioObjNew = audioObj.cloneNode(true); //this is to prevent "play() request was interrupted" error. 
        //     audioObjNew.currentTime = start;
        //     audioObjNew.play();
        //     audioObjNew.int = setInterval(function() {
        //         if (audioObjNew.currentTime > stop) {
        //             audioObjNew.pause();
        //             clearInterval(audioObjNew.int);
        //         }
        //     }, 10);
        // } 

    }

    toneTest(){ 
        const synth = new Tone.Synth().toDestination();

        //play a middle 'C' for the duration of an 8th note
        synth.triggerAttackRelease("C4", "8n");
        // const player = new Tone.Player(this.audio[0]).toDestination();
        // Tone.loaded().then(() => {
        //         player.start();
        // });
    }

    loop(){
		requestAnimationFrame(this.loop.bind(this))
		// Object.keys(this._analyses).forEach(key => {
		// 	this._analyses[key] = -1

		// })
        // console.log(this._analyses['pitch'])
        
        var result_pitch = this._pitch.getPitch();
        // console.log(result_pitch.note);
        //this.levelRangeElement.value = result_pitch.frequency;        //note의 frequency??
        //this.labelElem_freq.innerText = result_pitch.frequency; 
        this.labelElem_note.innerText = result_pitch.note;
        console.log("note", result_pitch.frequency);


        this.webaudioAnalyser.getByteFrequencyData(this.freqByteData);
        this.webaudioAnalyser.getByteTimeDomainData(this.timeByteData);// array of all 1024 levels
        var data = {f:this.freqByteData, t:this.timeByteData}
        console.log(this.freqByteData);                         // stream data value

        this.labelElem_freq.innerText = this.freqByteData;
        this.labelElem_amp.innerText = this.timeByteData;
        
        const canvas = this.visualiserElem;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        var waveSum = 0;
            for (let i = 0; i<data.f.length; i++) {
                ctx.fillStyle="blue";
                ctx.fillRect(i, canvas.height, 1, -data.f[i]);
                waveSum += data.f[i]; //add current bar value (max 255)
              }
              for (let i = 0; i<data.t.length; i++) {
                ctx.fillStyle="red";
                ctx.fillRect(i*2, data.t[i], 1, 1);
              }

	}


    //invoke the callback only if the analysis has not been run this loop
	getAnalysis(name, cb){
		if (this._analyses[name] === -1 || typeof this._analyses[name] === 'undefined'){
			this._analyses[name] = cb()
		}
		return this._analyses[name]
	}
	
	getPitch(){
		return this.getAnalysis('pitch', () => this._pitch.getPitch())
	}

    getWaveform(){
		return this.getAnalysis('waveform', () => this._waveform.getValue())
	}

    connect(to){
		this._source.connect(to)
	}

    createVisualiser() {
        // Analyzer 구현하기

        // feature data 확인용 element 연결
        this.levelRangeElement = document.querySelector("input");
        this.labelElem_freq = document.getElementById("label-freq");
        this.labelElem_amp = document.getElementById("label-amp");
        this.labelElem_note = document.getElementById("label-note");
        this.labelElem_rms = document.getElementById("label-rms");

        this.audioContext = new AudioContext();
        Tone.setContext(this.audioContext);
        this.src = this.audioContext.createMediaElementSource(this.audioElem);
        
        this.webaudioAnalyser = this.audioContext.createAnalyser();
        Tone.connect(this.src, this.webaudioAnalyser);

        var gainNode = this.audioContext.createGain();
        Tone.connect(this.webaudioAnalyser, gainNode);

        
        this._pitch = new Pitch(gainNode);
        this._waveform = this._pitch.getLastNode();
        Tone.connect(this._waveform, this.audioContext.destination)
        
        // ---- 여기까지 node connection 완료

        this._source = gainNode
        this._analyses = {}

        // ---- 여기부터 analyzer loop 작업 시작


        this.webaudioAnalyser.fftSize = 128;
        const bufferLength = this.webaudioAnalyser.frequencyBinCount;
        this.freqByteData = new Uint8Array(bufferLength);
        this.timeByteData = new Uint8Array(bufferLength);

        // this.webaudioAnalyser.fftSize = 128;
        // this.freqByteData = new Uint8Array(this.webaudioAnalyser.fftSize/2);
        // this.timeByteData = new Uint8Array(this.webaudioAnalyser.fftSize/2);

        // pitch & webaudio analyzer loop
        this.loop()

        // meyda analyzer loop
       
        this.meydaAnalyser = Meyda.createMeydaAnalyzer({
            audioContext: this.audioContext,
            source: this.src,
            bufferSize: 512,
            featureExtractors: ["rms"],
            callback: (features) => {
                this.levelRangeElement.value = features.rms;
                this.labelElem_rms.innerText = features.rms;
                this.feature = features.rms;
            },
            });
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