<template>
  <div class="flex justify-center py-10">
    <div class="max-w-xs w-full">
      <div class="text-center mb-10">
        <img src="../../assets/img/logo.png" alt="Logo" class="mx-auto mb-2 h-12 w-full object-contain">
        <span class="text-xl font-medium text-text-base">
          Sign in to TLC-Suggest
        </span>
      </div>
      <form action="">
        <div class="flex flex-col space-y-1 mb-2">
          <label for="" class="text-sm text-text-muted">
            Username or email address
          </label>
          <BaseInput
            size="sm"
          />
        </div>
        <div class="flex flex-col space-y-1 mb-6">
          <label for="" class="text-sm text-text-muted">
            Password
          </label>
          <BaseInput
            size="sm"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
          />
          <div class="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="showPassword"
              v-model="showPassword"
              class="h-3 w-3 border border-border-muted cursor-pointer"
            />
            <label for="showPassword" class="text-sm text-text-muted">
              Show Password
            </label>
          </div>
        </div>
        <BaseButton
          label="Login"
          variant="primary"
          class="w-full"
          size="sm"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const password = ref('')
const showPassword = ref(false)
</script>
