import { computed } from 'vue'
import { withMinDelay } from '@/utils/withMinDelay'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  authService,
  type AuthenticationError,
  type SigninCredentials,
} from '@/services/authService'

export const AUTH_QUERY_KEYS = {
  user: ['auth', 'user'] as const,
  all: ['auth'] as const,
}

export function useAuth() {
  const queryClient = useQueryClient()

  const userQuery = useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => (error as AuthenticationError).statusCode !== 401 && failureCount < 2,
  })

  const signInMutation = useMutation({
    mutationFn: (credentials: SigninCredentials) => withMinDelay(authService.authenticate(credentials)),
    onSuccess: async (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, data.user)
      await userQuery.refetch()
    },
    onError: (error: AuthenticationError) => {
      console.error('Sign in failed:', error.message)
    },
  })

  const signOutMutation = useMutation({
    mutationFn: () => authService.signout(),
    onSettled: () => {
      queryClient.clear()
    },
  })

  const signOutAllMutation = useMutation({
    mutationFn: () => authService.signoutAll(),
    onSettled: () => {
      queryClient.clear()
    },
  })

  const isAuthenticated = computed(() =>
    authService.isAuthenticated() && !!userQuery.data.value
  )

  const isLoading = computed(() =>
    userQuery.isLoading.value || signInMutation.isPending.value
  )

  return {
    user: computed(() => userQuery.data.value),
    isAuthenticated,
    isLoading,
    isLoadingUser: userQuery.isLoading,
    userError: userQuery.error,

    signIn: signInMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,

    signOut: signOutMutation.mutateAsync,
    isSigningOut: signOutMutation.isPending,

    signOutAll: signOutAllMutation.mutateAsync,
    isSigningOutAll: signOutAllMutation.isPending,

    refetchUser: userQuery.refetch,
    invalidateUser: () => queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user }),
  }
}
