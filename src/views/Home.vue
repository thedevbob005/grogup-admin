<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg3>
        <v-card color="blue-grey darken-2">
          <v-card-title>
            <div class="headline">Bars</div>
          </v-card-title>
          <v-card-text class="text-xs-center" style="font-size: xx-large">
            32*
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn flat>Add more</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  components: {},
  created () {
    this.$store.state.titleBarText = 'Dashboard'
  }
}
</script>
