<script>
export default {
  name: "AboutView",
  data() {
    return {

    }
  },
}
</script>

<template>
  <div class="grid grid-rows-2 w-full mt-6 ml-8">
    <div>
      <p class="text-2xl"><u>About</u></p>
      <p class="text-lg mt-2">
        This is a demo application for tracking worker qualifications.
        <br>
        Data is saved in an in-memory database, so there are limits on the amount of workers and qualifications that can be added to the database.
        <br>
        You can add new Workers and see the database limits in the Add Workers tab.
        <br>
        You can select multiple workers to assign qualifications to in the Worker Management tab.
      </p>
    </div>

  </div>

</template>

<style scoped>

</style>