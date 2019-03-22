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
              v-model="menuname"
              :rules="nameRules"
              :counter="32"
              label="Menu name"
              required
            ></v-text-field>
            <picture-input
              ref="pictureInput"
              width="200"
              height="300"
              margin="16"
              accept="image/jpeg,image/png"
              size="1"
              button-class="btn"
              :custom-strings="{ upload: '<h1>Bummer!</h1>', drag: 'Drag a 600px x 900px image' }"
              @change="onChange">
            </picture-input>
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
            :items="allMenus"
            :loading="isReloadingData"
          >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
              <td><v-img :src="'https://grogup.com/uploads/'+props.item.menu_image" height="80"></v-img></td>
              <td>{{ props.item.menu_name }}</td>
              <td class="text-xs-right"><v-btn flat small icon color="red" class="mr-0" @click="removeThis(props.item.menu_id)"><v-icon>mdi-close</v-icon></v-btn></td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PictureInput from 'vue-picture-input'
export default {
  components: { PictureInput },
  data: () => ({
    valid: false,
    menuname: '',
    menuimage: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => v.length <= 32 || 'Name must be less than 32 characters'
    ],
    isReloadingData: false,
    headers: [
      { text: 'Menu Image', value: 'menu_image', sortable: false },
      { text: 'Menu Name', value: 'menu_name' },
      { text: 'Action', align: 'right', sortable: false }
    ],
    allMenus: []
  }),
  created () {
    this.$store.state.titleBarText = 'Menus'
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
          that.allMenus = response.data.menus
          that.isReloadingData = false
        }
      })
  },
  methods: {
    addThis () {
      if (this.$refs.form.validate() && this.menuimage !== '') {
        this.isReloadingData = true
        // Do
        let that = this
        this.axios({
          method: 'post',
          url: '/menu/add',
          data: {
            menu_name: this.menuname,
            menu_image: this.menuimage
          }
        })
          .then((response) => {
            if (!response.data.success) {
              alert(response.data.reason)
              that.isReloadingData = false
            } else {
              that.allMenus = response.data.menus
              that.isReloadingData = false
              that.menuname = ''
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
        url: '/menu/remove',
        data: {
          menu_id: id
        }
      })
        .then((response) => {
          if (!response.data.success) {
            alert(response.data.reason)
            that.isReloadingData = false
          } else {
            that.allMenus = response.data.menus
            that.isReloadingData = false
          }
        })
    },
    onChange (image) {
      this.menuimage = image
    }
  }
}
</script>
