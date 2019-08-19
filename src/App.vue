<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "app",
  mounted(){
    this.$Message.config({
        top: 64,
        duration: 5
      });
  }
}
</script>

