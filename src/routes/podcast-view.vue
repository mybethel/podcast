<template>
  <div class="podcast-view">
    <spinner v-if="loading" />
    <div v-if="!loading">
      <img :src="podcast.image + '?w=350' | thumbnail" class="cover" width="350" />
      <div class="info">
        <h1>{{ podcast.name }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'podcast-view',
  data() {
    return {
      loading: true,
      podcast: {}
    }
  },
  created() {
    this.getPodcast();
  },
  watch: {
    '$route': 'getPodcast'
  },
  methods: {
    getPodcast() {
      if (!this.$route.params.id) return;

      this.$http.get(`http://api.bethel.io/podcast/${this.$route.params.id}`)
        .then(response => {
          this.loading = false;
          this.podcast = response.body;
        });
    }
  }
}
</script>

<style scoped>
</style>
