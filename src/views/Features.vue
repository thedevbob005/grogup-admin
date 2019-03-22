<template>
  <v-container fluid grid-list-xl>
    <v-form v-model="valid" ref="form" lazy-validation class="layout row wrap">
      <v-flex xs12 sm8 md6>
        <v-card color="grey darken-3">
          <v-card-title>
            <div class="headline">Add</div>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="feat"
              :rules="nameRules"
              :counter="32"
              label="Feature name"
              required
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn flat :disabled="!valid" @click="addThis" :loading="isReloadingData">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-form>
    <v-layout row wrap>
      <v-flex xs12 sm8 md6>
        <v-card color="grey darken-3">
          <v-card-title>
            <div class="headline">List</div>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="allFeatures"
            :loading="isReloadingData"
          >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
              <td>{{ props.item.feature_name }}</td>
              <td class="text-xs-right"><v-btn flat small icon color="red" class="mr-0" @click="removeThis(props.item.feature_id)"><v-icon>mdi-close</v-icon></v-btn></td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    feat: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => v.length <= 32 || 'Name must be less than 32 characters'
    ],
    isReloadingData: false,
    headers: [
      { text: 'Feature Name', value: 'feature_name' },
      {
        text: 'Action',
        align: 'right',
        sortable: false
      }
    ],
    allFeatures: []
  }),
  created () {
    this.$store.state.titleBarText = 'Features'
    this.isReloadingData = true
    // Do
    let that = this
    this.axios({
      method: 'post',
      url: '/feature/list'
    })
      .then((response) => {
        if (!response.data.success) {
          alert(response.data.reason)
          that.isReloadingData = false
        } else {
          that.allFeatures = response.data.features
          that.isReloadingData = false
        }
      })
  },
  methods: {
    addThis () {
      if (this.$refs.form.validate()) {
        this.isReloadingData = true
        // Do
        let that = this
        this.axios({
          method: 'post',
          url: '/feature/add',
          data: {
            feature_name: this.feat,
            feature_image: ''
          }
        })
          .then((response) => {
            if (!response.data.success) {
              alert(response.data.reason)
              that.isReloadingData = false
            } else {
              that.allFeatures = response.data.features
              that.isReloadingData = false
              that.feat = ''
            }
          })
      }
    },
    removeThis (id) {
      this.isReloadingData = true
      // Do
      let that = this
      this.axios({
        method: 'post',
        url: '/feature/remove',
        data: {
          feature_id: id
        }
      })
        .then((response) => {
          if (!response.data.success) {
            alert(response.data.reason)
            that.isReloadingData = false
          } else {
            that.allFeatures = response.data.features
            that.isReloadingData = false
          }
        })
    }
  }
}
</script>
