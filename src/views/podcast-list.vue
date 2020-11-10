<template>
  <div class="podcast-list">
    <a href="http://getbethel.com/"><svg><use xlink:href="#logo"></use></svg></a>
    <h1>Podcasting: powered by Bethel</h1>
    <p>We're making podcasting fast, easy and affordable for churches of all
      sizes! The churches below are podcasting on the Bethel Platform.</p>
    <a class="button" href="http://getbethel.com/">Get Started</a>
    <ul>
      <li
        v-for="podcast in podcasts.all"
        :key="podcast._id"
      >
        <router-link :to="'/' + podcast._id">
          <img :src="podcast.image | thumbnail" width="160" />
        </router-link>
      </li>
    </ul>
    <mugen-scroll :handler="getPodcasts" :should-handle="!podcasts.loading">
      <spinner v-if="!podcasts.last" />
    </mugen-scroll>
  </div>
</template>

<script>
import MugenScroll from 'vue-mugen-scroll'
import Podcast from '../services/podcast'

export default {
  name: 'podcast-list',
  data () {
    return {
      podcasts: Podcast.state
    }
  },
  created () {
    this.getPodcasts()
  },
  watch: {
    $route: 'getPodcasts'
  },
  methods: {
    getPodcasts () {
      this.loading = true

      Podcast.getAll()
    }
  },
  components: { MugenScroll }
}
</script>

<style scoped>
.podcast-list {
  padding: 60px 0;
  text-align: center;
}

h1, h2 {
  font-weight: normal;
}

a.button {
  margin-bottom: 2rem;
}

ul {
  list-style-type: none;
  line-height: 0;
  margin: 0 auto;
  max-width: 60rem;
  padding: 0;
}

li {
  display: inline-block;
  font-size: 0;
  margin: 0.25rem;
}

svg {
  max-width: 100px;
}

p {
  color: #a6a6a6;
  font-size: 1.2rem;
  margin: 0 auto 1rem;
  max-width: 40rem;
}
</style>
