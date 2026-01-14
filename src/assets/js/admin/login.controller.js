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
    console.log('🚀 Login Controller - Starting login process')
    console.log('📝 Login Controller - User:', user.value)
    console.log('🔒 Login Controller - Password length:', password.value.length)

    // Validación adicional en frontend
    if (!user.value || !user.value.trim()) {
      console.log('❌ Login Controller - User is empty')
      toast.error('El usuario es requerido')
      return
    }

    if (!password.value || !password.value.trim()) {
      console.log('❌ Login Controller - Password is empty')
      toast.error('La contraseña es requerida')
      return
    }

    try {
      console.log('⏳ Login Controller - Calling userStore.login()')
      toast.loading('Iniciando sesión...')
      await userStore.login(user.value.trim(), password.value.trim())
      console.log('✅ Login Controller - Login successful')
      toast.success('Inicio de sesión exitoso')
      router.push('/admin/dashboard')
    } catch (error) {
      console.log('❌ Login Controller - Login failed:', error)
      console.log('❌ Login Controller - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })

      // Determinar el mensaje de error específico
      let errorMessage = 'Credenciales inválidas'
      
      if (error.message.includes('No se puede conectar')) {
        errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo.'
      } else if (error.message.includes('Servidor no encontrado')) {
        errorMessage = 'Servidor no encontrado. Verifica la configuración del backend.'
      } else if (error.message.includes('No se recibió respuesta')) {
        errorMessage = 'No se recibió respuesta del servidor. Verifica la conexión a internet.'
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos incompletos. Verifica usuario y contraseña.'
      } else if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas. Verifica usuario y contraseña.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Error del servidor. Intenta nuevamente más tarde.'
      }

      toast.error(errorMessage)

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