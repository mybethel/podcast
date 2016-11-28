import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import Spinner from './components/spinner.vue'

import PodcastList from './routes/podcast-list.vue'
import PodcastView from './routes/podcast-view.vue'

Vue.filter('thumbnail', function(image) {
  const sizeRegex = /(?:\?|\&)w=(\d+)/;
  if (!image) image = 'DefaultPodcaster.png';
  let width = image.match(sizeRegex);
  width = width && width[1] || 320;
  image = image.replace(sizeRegex, '');
  return `https://images.bethel.io/images/${image}?fit=crop&w=${width}&h=${width}`;
});

Vue.component('spinner', Spinner);

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/', component: PodcastList },
    { path: '/:id', component: PodcastView }
  ]
});

const app = new Vue({ router }).$mount('#app');
