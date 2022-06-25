<template>
    <div>
        <h1>I am home</h1>
        <HelloWorld/>
          <av-waveform
    :audio-src="music">
  </av-waveform>
    </div>
</template>
<script>
import HelloWorld from '../components/HelloWorld.vue'

export default {
    name: 'Home',
    data() {
        return{
            music: require("../assets/audio/speech.mp3")
        }
    },
    components: {
        HelloWorld,
    },
    
};

</script>