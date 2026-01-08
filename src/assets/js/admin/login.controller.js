import { ref } from 'vue'
import { useUserStore } from '../../../stores/user.stores'
import { useRouter } from 'vue-router'

export function useLogin() {
  const user = ref('')
  const password = ref('')
  const router = useRouter()
  const userStore = useUserStore()

  const login = async () => {
    await userStore.login(user.value, password.value)
    router.push('/admin/dashboard')
  }

  return {
    user,
    password,
    login
  }
}