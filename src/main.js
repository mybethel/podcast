import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import PodcastList from './views/podcast-list.vue'
import PodcastView from './views/podcast-view.vue'
import vuetify from './plugins/vuetify'

import {
  VApp,
  VContainer,
  VMain
} from 'vuetify/lib'

Vue.filter('thumbnail', function (image) {
  const sizeRegex = /(?:\?|&)w=(\d+)/
  if (!image) image = 'DefaultPodcaster.png'
  let width = image.match(sizeRegex)
  width = (width && width[1]) || 320
  image = image.replace(sizeRegex, '')
  return `${image}?fit=crop&w=${width}&h=${width}`
})

Vue.use(VueResource)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: PodcastList },
    { path: '/:id', component: PodcastView }
  ]
})

new Vue({
  router,
  vuetify,
  render: h => h(VApp, [
    h(VMain, [
      h(VContainer, [h('router-view')])
    ])
  ])
}).$mount('#app')
