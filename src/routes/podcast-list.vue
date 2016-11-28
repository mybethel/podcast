<template>
  <div class="podcast-list">
    <a href="http://getbethel.com/"><img src="../assets/logo.svg" width="100" /></a>
    <h1>Podcasting: powered by Bethel</h1>
    <p>We're making podcasting fast, easy and affordable for churches of all
      sizes! The churches below are podcasting on the Bethel Platform.</p>
    <a class="button" href="http://getbethel.com/">Get Started</a>
    <spinner v-if="loading" />
    <ul>
      <li v-for="podcast in podcasts">
        <router-link :to="'/' + podcast._id">
        <img :src="podcast.image | thumbnail" width="160" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'podcast-list',
  data() {
    return {
      loading: false,
      podcasts: []
    }
  },
  created() {
    this.getPodcasts();
  },
  watch: {
    '$route': 'getPodcasts'
  },
  methods: {
    getPodcasts() {
      this.loading = true;

      this.$http.get('http://api.bethel.io/podcast?sort=updatedAt')
        .then(response => {
          this.loading = false;
          this.podcasts = response.body;
        });
    }
  }
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

p {
  color: #a6a6a6;
  font-size: 1.2rem;
  margin: 0 auto 1rem;
  max-width: 40rem;
}
</style>
