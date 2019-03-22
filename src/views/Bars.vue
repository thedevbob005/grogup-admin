<template>
  <v-container fluid grid-list-xl>
    <v-form v-model="valid" ref="form" lazy-validation class="layout row wrap">
      <v-flex xs12>
        <v-card color="grey darken-3">
          <v-card-title>
            <div class="headline">Add</div>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="barname"
              :rules="nameRules"
              :counter="32"
              label="Bar name"
              required
            ></v-text-field>
            <v-textarea
              v-model="bardesc"
              label="Bar Description"
              :rules="descRules"
              :counter="500"
              required
            ></v-textarea>
            <v-container fluid grid-list-xl>
              <v-layout row wrap>
                <v-flex xs12 sm6 lg3>
                  <picture-input
                    ref="pictureInputOne"
                    width="200"
                    height="100"
                    margin="16"
                    accept="image/jpeg,image/png"
                    size="1"
                    button-class="btn"
                    :custom-strings="{ upload: '<h1>Bummer!</h1>', drag: 'Drag a 600px x 300px image [main]' }"
                    @change="onChangeOne">
                  </picture-input>
                </v-flex>
                <v-flex xs12 sm6 lg3>
                  <picture-input
                    ref="pictureInputTwo"
                    width="200"
                    height="100"
                    margin="16"
                    accept="image/jpeg,image/png"
                    size="1"
                    button-class="btn"
                    :custom-strings="{ upload: '<h1>Bummer!</h1>', drag: 'Drag a 600px x 300px image' }"
                    @change="onChangeTwo">
                  </picture-input>
                </v-flex>
                <v-flex xs12 sm6 lg3>
                  <picture-input
                    ref="pictureInputThree"
                    width="200"
                    height="100"
                    margin="16"
                    accept="image/jpeg,image/png"
                    size="1"
                    button-class="btn"
                    :custom-strings="{ upload: '<h1>Bummer!</h1>', drag: 'Drag a 600px x 300px image' }"
                    @change="onChangeThree">
                  </picture-input>
                </v-flex>
                <v-flex xs12 sm6 lg3>
                  <picture-input
                    ref="pictureInputFour"
                    width="200"
                    height="100"
                    margin="16"
                    accept="image/jpeg,image/png"
                    size="1"
                    button-class="btn"
                    :custom-strings="{ upload: '<h1>Bummer!</h1>', drag: 'Drag a 600px x 300px image' }"
                    @change="onChangeFour">
                  </picture-input>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-select
                    :items="allFeatures"
                    v-model="barFeatures"
                    label="Select Features"
                    item-text="feature_name"
                    item-value="feature_id"
                    multiple
                  >
                    <template
                      slot="selection"
                      slot-scope="{ item, index }"
                    >
                      <span
                        v-if="index === 0"
                        class=""
                      >{{ barFeatures.length }} selected</span>
                    </template>
                  </v-select>
                </v-flex>
                <v-flex xs7 sm8>
                  <v-select
                    :items="allMenus"
                    item-text="menu_name"
                    item-value="menu_id"
                    label="Menu"
                    v-model="barMenuId"
                  ></v-select>
                </v-flex>
                <v-flex xs3 sm2>
                  <v-text-field
                    v-model="barMenuPrice"
                    label="Price"
                  ></v-text-field>
                </v-flex>
                <v-flex xs2 sm2>
                  <v-btn flat icon small color="blue" @click="addBarMenu"><v-icon>mdi-plus</v-icon></v-btn>
                </v-flex>
                <v-flex xs12>
                  <v-data-table
                    :headers="headerstwo"
                    :items="barMenus"
                  >
                    <template slot="items" slot-scope="props">
                      <td>{{ getBarMenuNameById(props.item.menu_id) }}</td>
                      <td>{{ props.item.menu_price }}</td>
                      <td class="text-xs-right"><v-btn flat small icon color="red" class="mr-0" @click="removeBarMenu(props.item.menu_id)"><v-icon>mdi-close</v-icon></v-btn></td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn flat :disabled="!valid" @click="addThis" :loading="isReloadingData">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-form>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card color="grey darken-3">
          <v-card-title>
            <div class="headline">List</div>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="allBars"
            :loading="isReloadingData"
          >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
              <td>{{ props.item.bar_name }}</td>
              <td>{{ props.item.bar_description }}</td>
              <td><v-img :src="'https://grogup.com/uploads/'+props.item.bar_image_one" height="80"></v-img></td>
              <td><v-img :src="'https://grogup.com/uploads/'+props.item.bar_image_two" height="80"></v-img></td>
              <td><v-img :src="'https://grogup.com/uploads/'+props.item.bar_image_three" height="80"></v-img></td>
              <td><v-img :src="'https://grogup.com/uploads/'+props.item.bar_image_four" height="80"></v-img></td>
              <td class="text-xs-right">
                <v-btn flat small icon color="red" class="mr-0" @click="removeThis(props.item.bar_id)"><v-icon>mdi-close</v-icon></v-btn>
              </td>
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
    barname: '',
    bardesc: '',
    barimageOne: '',
    barimageTwo: '',
    barimageThree: '',
    barimageFour: '',
    barFeatures: [],
    barMenus: [],
    barMenuId: '',
    barMenuPrice: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => v.length <= 32 || 'Name must be less than 32 characters'
    ],
    descRules: [
      v => !!v || 'Description is required',
      v => v.length <= 500 || 'Name must be less than 500 characters'
    ],
    isReloadingData: false,
    headers: [
      { text: 'Bar Name', value: 'bar_name' },
      { text: 'Bar Description', value: 'bar_description' },
      { text: 'Bar Image 1', value: 'bar_image_one', sortable: false },
      { text: 'Bar Image 2', value: 'bar_image_two', sortable: false },
      { text: 'Bar Image 3', value: 'bar_image_three', sortable: false },
      { text: 'Bar Image 4', value: 'bar_image_four', sortable: false },
      { text: 'Action', align: 'right', sortable: false }
    ],
    headerstwo: [
      { text: 'Menu Name' },
      { text: 'Menu Price', value: 'menu_price' },
      { text: 'Action', align: 'right', sortable: false }
    ],
    allMenus: [],
    allFeatures: [],
    allBars: []
  }),
  created () {
    this.$store.state.titleBarText = 'Bars'
    this.isReloadingData = true
    // Do
    let that = this
    this.axios({
      method: 'post',
      url: '/bar/list'
    })
      .then((response) => {
        if (!response.data.success) {
          alert(response.data.reason)
          that.isReloadingData = false
        } else {
          that.allBars = response.data.bars
          that.allMenus = response.data.menus
          that.allFeatures = response.data.features
          that.isReloadingData = false
        }
      })
  },
  methods: {
    removeBarMenu (id) {
      this.barMenus = this.barMenus.filter(function (obj) {
        return obj.menu_id !== id
      })
    },
    addBarMenu () {
      if (this.barMenuId !== '' && this.barMenuPrice !== '') {
        this.barMenus.push({
          menu_id: this.barMenuId,
          menu_price: this.barMenuPrice
        })
      } else {
        alert('Select a menu item and set a price first')
      }
    },
    getBarMenuNameById (id) {
      let v = this.allMenus.find(function (obj) {
        return obj.menu_id === id
      })
      return v.menu_name
    },
    addThis () {
      if (this.$refs.form.validate() && this.menuimage !== '') {
        this.isReloadingData = true
        // Do
        let that = this
        this.axios({
          method: 'post',
          url: '/bar/add',
          data: {
            bar_name: this.barname,
            bar_description: this.bardesc,
            bar_image_one: this.barimageOne,
            bar_image_two: this.barimageTwo,
            bar_image_three: this.barimageThree,
            bar_image_four: this.barimageFour,
            bar_features: this.barFeatures,
            bar_menus: this.barMenus
          }
        })
          .then((response) => {
            if (!response.data.success) {
              alert(response.data.reason)
              that.isReloadingData = false
            } else {
              that.allBars = response.data.bars
              that.isReloadingData = false
            }
          })
          .catch((err) => {
            that.isReloadingData = false
            console.log(err)
          })
      }
    },
    removeThis (id) {
      this.isReloadingData = true
      // Do
      let that = this
      this.axios({
        method: 'post',
        url: '/bar/remove',
        data: {
          bar_id: id
        }
      })
        .then((response) => {
          if (!response.data.success) {
            alert(response.data.reason)
            that.isReloadingData = false
          } else {
            that.allBars = response.data.bars
            that.isReloadingData = false
          }
        })
    },
    onChangeOne (image) {
      this.barimageOne = image
    },
    onChangeTwo (image) {
      this.barimageTwo = image
    },
    onChangeThree (image) {
      this.barimageThree = image
    },
    onChangeFour (image) {
      this.barimageFour = image
    }
  }
}
</script>
