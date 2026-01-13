import { ref } from 'vue'
import { useUserStore } from '../../../stores/user.stores'
import { useRouter } from 'vue-router'
import { toast } from '../../../utils/toast'

export function useLogin() {
  const user = ref('')
  const password = ref('')
  const router = useRouter()
  const userStore = useUserStore()

  const login = async () => {
    try {
      toast.loading('Iniciando sesión...')
      await userStore.login(user.value, password.value)
      toast.success('Inicio de sesión exitoso')
      router.push('/admin/dashboard')
    } catch (error) {
      toast.error('Credenciales inválidas')

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