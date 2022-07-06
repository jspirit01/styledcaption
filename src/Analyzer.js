// import * as Pitchfinder from 'pitchfinder'
// import { Gain, Waveform } from 'tone'
// import * as Tone from 'tone'
// import { Pitch } from './Pitch'
// import Meyda from 'meyda';

// export default class Analyzer {
//     constructor() {
//         this.meydaAnalyzer = null;

//     }

//     analyze(chunk){
//         let audioCtx = new AudioContext();
//         let offlineCtx = new OfflineAudioContext(2,chunk.length,44100);

      
//         var audioBuffer = audioCtx.createBuffer(2, chunk.length, this.sampleRate);
//         audioBuffer.getChannelData(0).set(chunk);
//         var source = offlineCtx.createBufferSource();
//         source.buffer = chunk;
//         var analyser = offlineCtx.createAnalyser();
//         source.connect(analyzer);


//         // function getData(audioURL) {
//         //     const request = new XMLHttpRequest();

//         //     request.open('GET', audioURL, true);

//         //     request.responseType = 'arraybuffer';


//         //     request.onload = function() {
//         //         let audioData = request.response;

//                 // audioCtx.decodeAudioData(audioData, function(buffer) {
//         //             source.buffer = buffer;
//         //             var analyser = offlineCtx.createAnalyser();
//         //             source.connect(analyser);
//         //             analyser.connect(offlineCtx.destination);

//         //             this.meydaAnalyser = Meyda.createMeydaAnalyzer({
//         //                 audioContext: offlineCtx,
//         //                 source: source,
//         //                 bufferSize: 512,
//         //                 featureExtractors: ["chroma"],
//         //                 callback: (features) => {
                    
//         //                 },
//         //                 });
//         //             this.meydaAnalyser.start()
//         //             source.start();

//         //             //source.loop = true;
//         //             offlineCtx.startRendering().then(function(renderedBuffer) {
//         //                 console.log('Rendering completed successfully');
//         //                 // const channelData = renderedBuffer.getChannelData(0);
                    
//         //                 // console.log("Data length "+ channelData.length.toString());
//         //                 // console.log(data);
//         //                 // // console.log("Data length "+ renderedBuffer.duration);
//         //                 // // for (let i = 0, length = data.length; i < length; i += 1) {
                    
//         //                 // //   // careful here, as you can hang the browser by logging this data
//         //                 // //   // because 1 second of audio contains 22k ~ 96k samples!
//         //                 // //   if (!(i % 1000) && i < 25000) console.log(i + " " + data[i]);
//         //                 // // }  
//         //                 // console.log(Meyda.extract("rms", renderedBuffer));

//         //                 let song = audioCtx.createBufferSource();
//         //                 song.buffer = renderedBuffer;
//         //                 var songAnalyzer = audioCtx.createAnalyser();
//         //                 song.connect(songAnalyzer);
//         //                 songAnalyzer.connect(audioCtx.destination);

//         //                 play.onclick = function() {

                         


//         //                     // var frequencyBins = new Uint8Array(128);
                            
//         //                     // console.log(frequencyBins);
//         //                     // // You can also get the result of any filtering or any other stage here:

//         //                     // function renderFrame() {
//         //                     //     requestAnimationFrame(renderFrame);
//         //                     //     songAnalyzer.getByteFrequencyData(frequencyBins);
//         //                     //     console.log(frequencyBins);                         // stream data value
//         //                     // }

//         //                     // renderFrame();                       
//         //                     song.start();
//         //                 }
//         //             }).catch(function(err) {
//         //                 console.log('Rendering failed: ' + err);
//         //                 // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
//         //             });
//         //         });
//         //     }

//         //     request.send();
//         // }

//         // Run getData to start the process off

//         getData(this.audio[1].url);
//     }
// }