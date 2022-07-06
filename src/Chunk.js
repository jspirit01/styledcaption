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


    }
    createChunk(chunk) {

        // const offlineCtx = new OfflineAudioContext(2,chunk.length,this.sampleRate);
        // const audioBuffer = offlineCtx.createBuffer(2,chunk.length,this.sampleRate);    //chunk를 넣을 새로운 비어있는 버퍼를 생성 
        // audioBuffer.getChannelData(0).set(chunk);       //비어있는 버퍼에 chunk 데이터를 넣음
        // var source = offlineCtx.createBufferSource();   //버퍼를 재생하거나 조작할 수 있는 AudioBufferSourceNode를 생성한다.
        // source.buffer = audioBuffer;    //그리고 그 SourceNode에 chunk데이터가 담긴 버퍼로 설정하겠다.
        // source.connect(offlineCtx.destination)
        
        //--------------------------------------
        // var audioBuffer = this.ctx.createBuffer(2, chunk.length, this.sampleRate);
        // audioBuffer.getChannelData(0).set(chunk);
        // console.log("audioBuffer", audioBuffer);
        // var source = this.ctx.createBufferSource();
        // source.buffer = audioBuffer;
        // console.log("audioSourceBuffer", audioBuffer);
        // source.connect(this.ctx.destination);
        // source.start();
        //--------------------------------------
        var context = new OfflineAudioContext(2,chunk.length,this.sampleRate);
        
        var analyser = context.createAnalyser();

        var source = context.createBufferSource();
        const buffer = context.createBuffer(2,chunk.length,this.sampleRate);    //chunk를 넣을 새로운 비어있는 버퍼를 생성 
        buffer.getChannelData(0).set(chunk);       //비어있는 버퍼에 chunk 데이터를 넣음 
        source.buffer = buffer;
        source.connect(analyser);
        analyser.connect(context.destination);

        this.meydaAnalyser = Meyda.createMeydaAnalyzer({
            audioContext: context,
            source: source,
            bufferSize: 512,
            featureExtractors: ["rms"],
            callback: (features) => {
                console.log("hi");
                console.log("HI", features.rms);
            },
            });

        this.meydaAnalyser.start();

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
        source.start();
       
        context.startRendering();
        //--------------------------------------
        // let offlineCtx = new OfflineAudioContext(2,bufferSize,this.sampleRate);
        // const audioBuffer = offlineCtx.createBuffer(2,bufferSize,this.sampleRate); 
        // audioBuffer.getChannelData(0).set(chunk);
        // const offlineSource = offlineCtx.createBufferSource();
        // offlineSource.buffer = audioBuffer;
        // console.log("offlineSourceBuffer", offlineSource.buffer)
        // var analyser = offlineCtx.createAnalyser();
        // offlineSource.connect(analyser);
        // analyser.connect(offlineCtx.destination);

        // this.meydaAnalyser = Meyda.createMeydaAnalyzer({
        //     audioContext: offlineCtx,
        //     source: offlineSource,
        //     bufferSize: 512,
        //     featureExtractors: ["rms"],
        //     callback: (features) => {
        //         console.log("hi");
        //         console.log("HI", features.rms);
        //     },
        //     });


        // this.meydaAnalyser.start()
        // offlineSource.start();

        //--------------------------------------
        // const context = new Tone.OfflineContext(2, chunk.length, this.sampleRate);
        
        // const buffer =  context.createBuffer(2, chunk.length, this.sampleRate);
        // buffer.getChannelData(0).set(chunk);
        // const tsource = context.createBufferSource();
        // tsource.buffer = buffer;
        // const analyzer = context.createAnalyser();

        
        // console.log("tone audioBuffer", tsource.buffer);
        // Tone.connect(tsource, analyzer);
        // console.log(analyzer)

        // // Tone.connect(analyzer, context.destination)
        // // var gainNode = context.createGain();
        // // Tone.connect(analyzer, gainNode);

        // this._pitch = new Pitch(analyzer);
        // this._waveform = this._pitch.getLastNode();

        // Tone.connect(this._waveform, context.destination);

        // this._source = gainNode
        // this._analyses = {}

        // this.loop()


        //--------------------------------------
        // source.onended = (e) => {
        //     this.chunks.splice(this.chunks.indexOf(source), 1);
        //     if (this.chunks.length == 0) {
        //         this.isPlaying = false;
        //         this.startTime = 0;
        //         this.lastChunkOffset = 0;
        //     }
        // };

        // console.log("chunks length: ", this.chunks.length)
        return source;
    }

    loop(){
		requestAnimationFrame(this.loop.bind(this))
		// Object.keys(this._analyses).forEach(key => {
		// 	this._analyses[key] = -1

		// })
        // console.log(this._analyses['pitch'])
        
        var result_pitch = this._pitch.getPitch();
        console.log(result_pitch.note);


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