<template>
    <div>
        <h1>I am home</h1>
        <HelloWorld/>
    </div>
</template>
<script>
import HelloWorld from '../components/HelloWorld.vue'

export default {
    name: 'Home',
    components: {
        HelloWorld,
    },
};

</script>