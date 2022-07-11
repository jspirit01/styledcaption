import Meyda from 'meyda';
import Analyzer from './Analyzer.js'
import * as Tone from 'tone'
import { Pitch } from './Pitch'

export default class SoundBuffer {
    constructor(ctx, sampleRate, bufferSize = 6, debug = true) {
        this.ctx = ctx;
        this.sampleRate = sampleRate;
        this.bufferSize = bufferSize;
        this.debug = debug;
        this.chunks = [];
        this.isPlaying = false;
        this.startTime = 0;
        this.lastChunkOffset = 0;
        this.meydaAnalyser = null; 

        this.requestId = undefined;
    }
    createChunk(chunk) {
        // //--online
        // Tone.setContext(this.ctx);

        // var source = this.ctx.createBufferSource();
        // var audioBuffer = this.ctx.createBuffer(2, chunk.length, this.sampleRate);
        // audioBuffer.getChannelData(0).set(chunk);
        // source.buffer = audioBuffer;

        // var analyser = this.ctx.createAnalyser();
        // Tone.connect(source, analyser);

        // var gainNode = this.ctx.createGain();
        // Tone.connect(analyser, gainNode);

        // this._pitch = new Pitch(gainNode);
        // this._waveform = this._pitch.getLastNode();
        // Tone.connect(this._waveform, this.ctx.destination);

        // this._source = gainNode
        // this._analyses = {}

        // source.start();

        // this.loop()


        // source.onended = (e) => {
        //     this.stop();
        // };
       
        //--offline
        var context = new OfflineAudioContext(2,chunk.length,this.sampleRate);
        Tone.setContext(context)
        
        var source = context.createBufferSource();
        const buffer = context.createBuffer(2,chunk.length,this.sampleRate);    //chunk를 넣을 새로운 비어있는 버퍼를 생성 
        buffer.getChannelData(0).set(chunk);       //비어있는 버퍼에 chunk 데이터를 넣음 
        source.buffer = buffer;
        
        var analyser = context.createAnalyser();
        Tone.connect(source, analyser);

        var gainNode = context.createGain();
        Tone.connect(analyser, gainNode);

        this._pitch = new Pitch(gainNode);
        this._waveform = this._pitch.getLastNode();
        Tone.connect(this._waveform, context.destination);

        this._source = gainNode
        this._analyses = {}

        const bufferLength = analyser.frequencyBinCount;
        this.freqByteData = new Uint8Array(bufferLength);
        
        source.start();
        context.startRendering();
        this.loop()

        // const featureArray = [];
        // this.meydaAnalyser = Meyda.createMeydaAnalyzer({
        //     audioContext: context,
        //     source: source,
        //     bufferSize: 512,
        //     featureExtractors: ["rms"],
        //     callback: (features) => {
        //         console.log(features.rms);
        //         featureArray.push(features.rms);

        //         const result = featureArray.reduce(function add(sum, currValue) {
        //             return sum + currValue;
        //         }, 0);
        //         const average = result / featureArray.length;
        //         console.log("AVERAGE: ", average)
        //     },
        //     });
        // this.meydaAnalyser.start()
        
        context.oncomplete = function(e){
            console.log("audio processed ----------------------------");

            //var audioBuffer = e.renderedBuffer;
            // console.log(audioBuffer);
            
            var frequencyBins = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(frequencyBins);
            console.log(frequencyBins);
            // You can also get the result of any filtering or any other stage here:
            console.log(e.renderedBuffer);
        }

        return source;
    }

    loop(){
		this.requestId = requestAnimationFrame(this.loop.bind(this))
		// Object.keys(this._analyses).forEach(key => {
		// 	this._analyses[key] = -1

		// })
        // console.log(this._analyses['pitch'])
        
        var result_pitch = this._pitch.getPitch();
        console.log("note", result_pitch.frequency);

        // console.log(this.freqByteData)
	}

    stop(){
        console.log("STOP");
        if(this.requestId){
            cancelAnimationFrame(this.requestId);
            this.requestId = undefined;
        }
    }

    log(data) {
        if (this.debug) {
            console.log(new Date().toUTCString() + " : " + data);
        }
    }
    addChunk(data) {
        if (this.isPlaying && (this.chunks.length > this.bufferSize)) {
            this.log("chunk discarded");
            return; // throw away
        }
        else if (this.isPlaying && (this.chunks.length <= this.bufferSize)) { // schedule & add right now
            this.log("chunk accepted");
            let chunk = this.createChunk(data);
            chunk.start(this.startTime + this.lastChunkOffset);
            this.lastChunkOffset += chunk.buffer.duration;
            this.chunks.push(chunk);
        }
        else if ((this.chunks.length < (this.bufferSize / 2)) && !this.isPlaying) { // add & don't schedule
            this.log("chunk queued");
            let chunk = this.createChunk(data);
            this.chunks.push(chunk);
        }
        else { // add & schedule entire buffer
            this.log("queued chunks scheduled");
            this.isPlaying = true;
            let chunk = this.createChunk(data);
            this.chunks.push(chunk);
            this.startTime = this.ctx.currentTime;
            this.lastChunkOffset = 0;
            for (let i = 0; i < this.chunks.length; i++) {
                let chunk = this.chunks[i];
                chunk.start(this.startTime + this.lastChunkOffset);
                this.lastChunkOffset += chunk.buffer.duration;
            }
        }
    }
}