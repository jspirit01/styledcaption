import {createWebHistory, createRouter} from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Sound from "./views/Sound.vue";
import Speech from "./views/Speech.vue"


 //기본 path인 경우 Home을 띄우겠다
const routes= [
    {
        path: '/', 
        name: 'Home',
        component: Home, 
    },          
    {
        path: '/about', 
        name: 'About',
        component: About,
    },
    {
        path: '/sound', 
        name: 'Sound',
        component: Sound,
    },
    {
        path: '/speech', 
        name: 'Speech',
        component: Speech,
    },
];

// 라우터 정의
const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router;