import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import Home from './components/Home.vue'
import Check from './components/check.vue'
import PageNotFound from './components/PageNotFound.vue'

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/check',
        component: Check
    },

    {
        path: '*',
        component: PageNotFound
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

export default router