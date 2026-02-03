<template>
  <div class="flex justify-center py-10">
    <div class="max-w-xs w-full">
      <div class="text-center mb-10">
        <img src="../../assets/img/logo.png" alt="Logo" class="mx-auto mb-2 h-12 w-full object-contain">
        <span class="text-xl font-medium text-text-base">
          Sign in to TLC-Suggest
        </span>
      </div>

       <div class="text-xs text-text-muted flex flex-col space-y-1 mb-4">
          <span>
            Email: test@example.com
          </span>
          <span>
            Password: password
          </span>
        </div>

      <form @submit.prevent="handleSignIn">
        <BaseAlert
          v-if="signInError"
          severity="error"
          :closable="true"
          :message="signInError.message || 'Sign in failed. Please check your credentials.'"
          @close="signInError = null"
          class="mb-4"
        />
        <div class="flex flex-col space-y-1 mb-2">
          <label for="" class="text-sm text-text-muted">
            Username or email address
          </label>
          <BaseInput
            id="identity"
            v-model="credentials.identity"
            size="sm"
            :disabled="isSigningIn"
            required
            :class="{
              'border-red-500 focus:border-red-600 focus:ring-red-500/30':
                !!signInError,
            }"
          />
        </div>
        <div class="flex flex-col space-y-1 mb-6">
          <label for="" class="text-sm text-text-muted">
            Password
          </label>
          <BaseInput
            id="password"
            size="sm"
            :type="showPassword ? 'text' : 'password'"
            v-model="credentials.password"
            :disabled="isSigningIn"
            required
            :class="{
              'border-red-500 focus:border-red-600 focus:ring-red-500/30':
                !!signInError,
            }"
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
          type="submit"
          :label="isSigningIn ? 'Signing in...' : 'Sign in'"
          :loading="isSigningIn"
          variant="primary"
          class="w-full"
          size="sm"
          :disabled="isSigningIn"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/auth/useAuth'

const { signIn, isSigningIn, signInError } = useAuth()

const credentials = ref({
  identity: '',
  password: ''
})

const showPassword = ref(false)

async function handleSignIn() {
  try {
    await signIn(credentials.value)

    console.log('✅ Login successful, redirecting...')
    console.log('✅ Token:', localStorage.getItem('token'))
  } catch (err) {
    console.error('Sign in failed:', err)
  }
}
</script>
