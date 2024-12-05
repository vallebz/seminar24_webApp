// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../components/MainView.vue';
import Demo from '../components/Demo.vue';
import Start from '../components/Start.vue';
import Step_1 from '../components/Step_1.vue';
import Step_2 from '../components/Step_2.vue';
import Step_3 from '../components/Step_3.vue';
// import AnotherView from '../components/AnotherView.vue';

const routes = [
  {
    path: '/',
    name: 'Demo',
    component: Demo,
    children: [
      { path: '', name: 'start', component: Start }, 
      { path: 'step_1', name: 'DemoStep1', component: Step_1 },
      { path: 'step_2', name: 'DemoStep2', component: Step_2 },
      { path: 'step_3', name: 'DemoStep3', component: Step_3 },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  /// <reference types="vite/client" />
  routes,
});

export default router;