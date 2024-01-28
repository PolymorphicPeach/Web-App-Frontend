<script>
import axios from "axios";
import Chart from 'chart.js/auto';

export default{
  name: "AerialClassificationView",
  data(){
    return{
      staticMapSrc: "",
      latitude: 30.266,
      longitude: -97.733,
      zoom: 20,
      chartData: null,
      chart: null,
      chartSmallScreen: null,
    }
  },
  mounted(){
    // Set starting static map. MUST use back-ticks ( ` )
    this.staticMapSrc = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=${this.zoom}&size=600x600&maptype=satellite&key=AIzaSyA2mkc3bQEVVh8jBtByoheXKslMuqo-rXU`;
  },
  methods: {
    async submitForm(){
      this.staticMapSrc = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=${this.zoom}&size=600x600&maptype=satellite&key=AIzaSyA2mkc3bQEVVh8jBtByoheXKslMuqo-rXU`;
      await this.sendMapToBackend();
      await this.renderChart();
    },
    async sendMapToBackend(){
      try{
        // response should populate with the json data
        const backendUrl = "/api/aerial"
        const response = await axios.post(backendUrl,
            {
              imageUrl: this.staticMapSrc
            });
        this.chartData = response.data;
      }
      catch(error){
        console.error("Error sending image to backend: ", error);
      }
    },
    async renderChart(){
      const chartCanvas = document.getElementById("chartCanvas");
      const chartCanvasSmallScreen = document.getElementById("chartCanvasSmallScreen");

      // Destroy pre-existing chart
      if(this.chart){
        this.chart.destroy();
      }

      if(this.chartSmallScreen){
        this.chartSmallScreen.destroy();
      }

      const labels = Object.keys(this.chartData);
      const values = Object.values(this.chartData);

      const ctx = chartCanvas.getContext("2d");
      this.chart = new Chart(ctx, {
        type: "pie",
        data:{
          labels: labels,
          datasets:[
            {
              data: values
            }
          ]
        },
        options:{
          responsive: true,
          maintainAspectRatio: true,
        }
      });

      const ctxSmall = chartCanvasSmallScreen.getContext("2d");
      this.chartSmallScreen = new Chart(ctxSmall, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data:values
            }
          ]
        },
        options:{
          responsive: true,
          maintainAspectRatio: true,
        }
      })

    },
  }
}
</script>

<template>

  <!----------------- ALWAYS HIDDEN ------------------------------------->
  <div class="hidden">
    <!-- https://maps.googleapis.com/maps/api/staticmap?PARAMETERS -->
    <!-- Always present -->
    <img class="w-600 h-600" :src="staticMapSrc"/>
  </div>

  <!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
  <!-------------------------------- Medium Screens and larger ------------------------------------------------------------------------------------------------------------------------------------------------------->

  <div class="hidden md:grid grid-cols-2 gap-2">
    <!-- Column #1 -->
    <div class="p-1">
      <div class="grid grid-rows-2 gap-2">
        <!-- Column #1, Row #1 -->
        <div class="p-1">
          <div class="container mx-auto mt-8">
            <form @submit.prevent="submitForm" class="max-w-md mx-auto p-6 bg-peach-black rounded-md shadow-md">
              <div class="mb-4">
                <label for="latitude" class="block text-peach-peach text-sm font-bold mb-2">latitude:</label>
                <input v-model="latitude" type="number" id="latitude" name="latitude" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 appearance-none" step="any" required>
              </div>
              <div class="mb-4">
                <label for="longitude" class="block text-peach-peach text-sm font-bold mb-2">longitude:</label>
                <input v-model="longitude" type="number" id="longitude" name="longitude" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 appearance-none" step="any" required>
              </div>
              <div class="mb-4">
                <label for="zoom" class="block text-sm text-peach-peach font-bold mb-2">zoom:</label>
                <input v-model="zoom" type="number" id="zoom" name="zoom" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 appearance-none" step="any" required>
              </div>
              <button type="submit" class="w-full bg-peach-pink text-peach-black p-3 rounded-md hover:bg-peach-peach transition duration-300">Submit</button>
            </form>
          </div>
        </div>
        <!-- Column #1, Row #2 -->
        <div class="p-1 mt-0">
          <!-- Chart canvas -->
          <div class="w-100 h-100">
            <canvas id="chartCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>
    <!-- Column #2 -->
    <div class="p-1">
      <div>
        <img class="w-600 h-600" :src="staticMapSrc"/>
      </div>
    </div>
  </div>

  <!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
  <!-------------------------------- Smaller Screens ----------------------------------------------------------------------------------------------------------------------------------------------------------------->
  <div class="grid md:hidden grid-rows-3 gap-1">
    <!-- Row #1 -->
    <div class="p-1">
      <div>
        <img class="w-600 h-600" :src="staticMapSrc"/>
      </div>
    </div>

    <!-- Row #2 -->
    <div class="p-1">
      <div class="container mx-auto mt-0">
        <form @submit.prevent="submitForm" class="max-w-md mx-auto p-6 bg-peach-black rounded-md shadow-md">
          <div class="mb-4">
            <label for="latitude" class="block text-peach-peach text-sm font-bold mb-2">latitude:</label>
            <input v-model="latitude" type="number" id="latitude" name="latitude" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 appearance-none" step="any" required>
          </div>
          <div class="mb-4">
            <label for="longitude" class="block text-peach-peach text-sm font-bold mb-2">longitude:</label>
            <input v-model="longitude" type="number" id="longitude" name="longitude" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 appearance-none" step="any" required>
          </div>

          <div class="mb-4">
            <label for="zoom" class="block text-peach-peach text-sm font-bold mb-2">zoom:</label>
            <input v-model="zoom" type="number" id="zoom" name="zoom" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 appearance-none" step="any" required>
          </div>
          <button type="submit" class="w-full bg-peach-pink text-peach-black p-3 rounded-md hover:bg-peach-peach transition duration-300">Submit</button>
        </form>
      </div>
    </div>

    <!-- Row #3 -->
    <div class="p-1">
      <div class="w-100 h-100">
        <canvas id="chartCanvasSmallScreen"></canvas>
      </div>
    </div>

  </div>


</template>

<style scoped>

</style>