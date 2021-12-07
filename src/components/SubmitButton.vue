<template>
  <button type="submit" class="btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "SubmitButton",
};
</script>

<style lang="scss">
.btn {
  display: block;
  width: fit-content;
  background-color: #2c3e50;
  color: white;
  font-size: 1.2rem;
  border-radius: 1rem;
  padding: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    cursor: pointer;
  }
  a {
    color: white;
    text-decoration: none;
  }
}
</style>
