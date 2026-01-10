import { ref } from 'vue'
import { useUserStore } from '../../../stores/user.stores'
import { useRouter } from 'vue-router'

export function useLogin() {
  const user = ref('')
  const password = ref('')
  const router = useRouter()
  const userStore = useUserStore()

  const login = async () => {
    try {
        await userStore.login(user.value, password.value)
        router.push('/admin/dashboard')
    } catch (error) {
        alert('Credenciales inválidas')

        user.value = ''
        password.value = ''
    }
  }

  return {
    user,
    password,
    login
  }
}