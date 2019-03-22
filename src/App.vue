<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      v-if="$store.state.loggedIn"
    >
      <v-img aspect-ratio=1 :src="$store.state.loginDP">
        <v-layout
          pa-2
          column
          fill-height
          class="lightbox white--text"
        >
          <v-spacer></v-spacer>
          <v-flex shrink>
            <div class="subheading">
              {{ this.$store.state.loginName }}
            </div>
            <div class="body-1">
              Welcome to GrogUp Administration
            </div>
          </v-flex>
        </v-layout>
      </v-img>
      <v-list dense>

        <template v-for="(item, i) in menus">
          <v-layout
            v-if="item.heading"
            :key="i"
            row
            align-center
          >
            <v-flex xs12>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
          </v-layout>
          <v-divider
            v-else-if="item.divider"
            :key="i"
          ></v-divider>
          <v-list-tile
            v-else
            :key="i"
            :to="item.url"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>

        <v-list-tile @click="$store.commit('logout')">
          <v-list-tile-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app v-if="$store.state.loggedIn">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ $store.state.titleBarText }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="hidden-xs-only">GrogUp Administration</span>
    </v-toolbar>
    <v-content v-if="$store.state.loggedIn">
      <router-view/>
    </v-content>
    <v-footer app v-if="$store.state.loggedIn">
      <span class="white--text">&copy; Artific 2019</span>
    </v-footer>
    <v-content v-if="!$store.state.loggedIn">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-2">
              <v-toolbar color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="mdi-account-outline" name="login" label="Login" type="text" v-model="loginUsername"></v-text-field>
                  <v-text-field id="password" prepend-icon="mdi-lock-outline" name="password" label="Password" type="password" v-model="loginPassword"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="doLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<style>
  .lightbox {
    box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 96px);
  }
</style>

<script>

export default {
  name: 'App',
  data () {
    return {
      drawer: true,
      menus: [
        { icon: 'mdi-home', text: 'Dashboard', url: '/' },
        // { divider: true },
        // { heading: 'Bars' },
        // { icon: 'mdi-plus', text: 'Add new bar', url: '/barnew' },
        // { icon: 'mdi-format-list-bulleted', text: 'List all bars', url: '/barlist' },
        // { divider: true },
        // { heading: 'Menu' },
        // { icon: 'mdi-plus', text: 'Add new item', url: '/menunew' },
        // { icon: 'mdi-format-list-bulleted', text: 'List all menu items', url: '/menulist' },
        // { divider: true },
        // { heading: 'Others' },
        { icon: 'mdi-format-list-bulleted', text: 'Bars', url: '/bars' },
        { icon: 'mdi-format-list-bulleted', text: 'Menus', url: '/menus' },
        { icon: 'mdi-format-list-bulleted', text: 'Features', url: '/features' },
        { divider: true },
        { icon: 'mdi-settings', text: 'Settings', url: '/settings' }
      ],
      loginUsername: '',
      loginPassword: ''
    }
  },
  created () {
    this.doRefresh()
    setInterval(this.doRefresh, 15000)
  },
  methods: {
    doLogin: function () {
      let that = this
      this.axios({
        method: 'post',
        url: '/login',
        data: {
          username: this.loginUsername,
          password: this.loginPassword
        }
      })
        .then((response) => {
          if (!response.data.success) {
            alert(response.data.reason)
          } else {
            that.$store.commit('login', {
              token: response.data.token,
              name: response.data.name,
              dp: response.data.dp
            })
          }
        })
    },
    doRefresh: function () {
      if (this.$store.state.loginToken.length > 5) {
        let that = this
        this.axios({
          method: 'post',
          url: '/login',
          data: {
            loginhash: this.$store.state.loginToken
          }
        })
          .then((response) => {
            if (!response.data.success) {
              alert(response.data.reason)
              that.$store.commit('logout')
            } else {
              that.$store.commit('login', {
                token: response.data.token,
                name: response.data.name,
                dp: response.data.dp
              })
            }
          })
      }
    }
  }
}
</script>
