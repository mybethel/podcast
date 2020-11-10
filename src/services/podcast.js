import Vue from 'vue'
import VueResource from 'vue-resource'
import { API_ROOT } from '../config'

Vue.use(VueResource)

const Podcast = Vue.resource('podcast{/id}{?page}&sort=-updatedAt', {}, {
  media: { method: 'GET', url: 'podcast{/id}/media{?page}&sort=-updatedAt' }
}, { root: API_ROOT })

export default {

  state: {
    last: false,
    loading: true,
    all: []
  },

  _id: null,
  _next: 1,

  getAll () {
    if (this.state.last) return
    this.state.loading = true

    return Podcast.get({ page: this._next })
      .then(response => {
        console.log(response)
        if (response.body.paging.next) {
          this._next = this._next + 1
        } else {
          this.state.last = true
        }

        this.state.all = this.state.all.concat(response.body.data)
        this.state.loading = false
      })
  }

}
