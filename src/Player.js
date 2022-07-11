import SoundBuffer from './Chunk.js'

export default class Player {
    constructor(selector = '.audioPlayer', audio = []) {
        
        this.audioContext = null
        this.audio = audio;
        this.playerElem = document.querySelector(selector);
        this.captionElem = document.getElementById('caption-text');
        this.createPlayerElements()
        this.soundBuffer = null; 
        this.lasChuckOffset = 0;
        this.isPlaying = 0;
        
        this.currentAudio = this.audio[0];      //오디오 선택하는 코드 짜면 여기 변경할 것
        this.currentAudioItem = null;

        this.currentChunk = null;
        this.currentChunkId = 0;
    }

    initialize(){
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();        
    }

    prepareBuffer(){
        const SAMPLERATE = 44100;

        const CAPTION_TOTAL_NUM = Object.keys(this.currentAudio.timeline).length;
        const LEGNTH = Math.ceil(this.currentAudio.timeline[CAPTION_TOTAL_NUM-1].endTime);
        let audioCtx = new AudioContext();
        let offlineCtx = new OfflineAudioContext(2, SAMPLERATE*LEGNTH, SAMPLERATE);
        // let offlineCtx = new OfflineAudioContext(2);

        this.soundBuffer = new SoundBuffer(audioCtx, SAMPLERATE);
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
                    console.log("decodeBuffer", buffer);
                    source.buffer = buffer;
                    source.connect(offlineCtx.destination);
                    source.start();
                    //source.loop = true;
                    offlineCtx.startRendering().then(function(renderedBuffer) {
                        console.log('Rendering completed successfully');
                        
                        const audioArray = renderedBuffer.getChannelData(0)

                        console.log("renderedBuffer", renderedBuffer);
                        //console.log("audioArray", audioArray);
                        
                        for (let i = 0, length = CAPTION_TOTAL_NUM; i < length; i++){
                            let startTime = timeline[i].startTime;
                            let endTime = timeline[i].endTime;
                            
                            let data = audioArray.slice(startTime * SAMPLERATE, endTime * SAMPLERATE);
                            
                            let chunk = soundBuffer.createChunk(data);
                            soundBuffer.chunks.push(chunk);
                            console.log("push chunk ---------------------------------")
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
        getData(this.currentAudio.url, this.currentAudio.timeline, this.soundBuffer);

        
        this.currentChunk = this.soundBuffer.chunks[0];
        this.cid = 0;
        this.notCompleted = false;

    }

    createPlayerElements() {
        this.audioElem = document.createElement('audio');
        const playListElem = document.createElement('div');
        const videoContainerElem = document.createElement('div');
        videoContainerElem.classList.add('video-container');
        this.videoElem = document.createElement('video');
        playListElem.classList.add('playlist');
        //const playElem = document.createElement('button');
        //playElem.classList.add('play');             // play라는 class를 추가. 
        //playElem.innerHTML = '<i class="fa fa-play"></i>';              //play 아이콘 추가
        this.playerElem.appendChild(this.audioElem);
        this.playerElem.appendChild(playListElem);
        videoContainerElem.appendChild(this.videoElem);
        this.playerElem.appendChild(videoContainerElem);


        this.createPlayListElements(playListElem);
    }

    createPlayListElements(playListElem) {
        let i = 0;
        var audio2index = {}
        this.audio.forEach(audio => {
            audio2index[audio.name] = i; 
            const audioItem = document.createElement('a');
            audioItem.href = audio.url;
            audioItem.innerHTML = `<i class="fa fa-play"></i>${audio.name}`;
            this.setEventListener(audioItem);
            playListElem.appendChild(audioItem);
            i+=1;
        });
        this.audio2index = audio2index
    }

    setEventListener(audioItem) {
        audioItem.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.audioContext) {
                console.log("#1")
                //this.initialize();      
                //this.prepareBuffer();   //buffer chunks 준비 함수
                
            }
            const isCurrentAudio = audioItem.getAttribute('href') == (this.currentAudioItem && this.currentAudioItem.getAttribute('href'));

            if (isCurrentAudio && !this.audioElem.paused) {
                console.log("#2")
                this.setPlayIcon(this.currentAudioItem);
                this.audioElem.pause();
            } else if (isCurrentAudio && this.audioElem.paused) {
                console.log("#3")
                this.setPauseIcon(this.currentAudioItem);
                this.audioElem.play();
            } else {
                // 오디오 변경 및 시작 부분
              
                if (this.currentAudioItem) {
                    console.log("#4")
                    this.setPlayIcon(this.currentAudioItem);
                }
                console.log("#5")
                
                this.currentAudioItem = audioItem;          // 클릭한 오디오로 audioItem <a> 변경
                this.setPauseIcon(this.currentAudioItem);   // puase 아이콘으로 변경
                this.audioElem.src = this.currentAudioItem.getAttribute('href');    //
                
                
                // 오디오 정보 변경
                var audioName = audioItem.innerText;
                var clickAudioIndex = this.audio2index[audioName];
                
                this.currentAudio = this.audio[clickAudioIndex];

                // chunks 프로세싱 및 준비
                this.prepareBuffer();   
                
                this.audioElem.play();
                this.audioElem.ontimeupdate = e => {
                    //console.log(this.audioElem.currentTime);
                    // if (this.cid == this.soundBuffer.chunks.length){
                    //     this.cid = 0;
                    //     this.lastChunk = true;
                    // }
                    //console.log(this.cid, this.soundBuffer.chunks.length);
                    if (this.cid < this.soundBuffer.chunks.length){
                        
                        let captionItem = this.currentAudio.timeline[this.cid];
                        if (!this.notCompleted && this.audioElem.currentTime >= captionItem.startTime ) {
                            // change caption
                            this.captionElem.innerText = captionItem.text;

                            // and then, move next chunk
                            //console.log(this.cid, this.soundBuffer.chunks.length)
                            this.cid += 1
                            this.currentChunk = this.soundBuffer.chunks[this.cid];
                        }
                    }
                }
                this.audioElem.onended = e => this.setPlayIcon(this.currentAudioItem);
                
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

    updateCaption(){

    }

}