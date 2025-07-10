<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-xl">P</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p class="text-muted-foreground">Sign in to your Plinko Game account</p>
      </div>

      <Card class="backdrop-blur-sm">
        <CardContent class="p-6">
          <form @submit.prevent="submitLogin" class="space-y-4">
            <template v-for="field in fields" :key="field.name">
              <div class="space-y-2">
                <Label
                  :for="field.name"
                  class="text-foreground font-medium"
                >
                  {{ field.label }}
                </Label>
                <Input
                  :type="field.type"
                  :id="field.name"
                  v-model="form[field.name]"
                  class="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring/20"
                  :placeholder="`Enter your ${field.label.toLowerCase()}`"
                />
              </div>
            </template>

            <div v-if="errors.general" class="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              <AlertCircle class="w-4 h-4" />
              {{ errors.general }}
            </div>

            <Button
              type="submit"
              class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Sign In
            </Button>
          </form>

          <div class="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <h3 class="text-sm font-medium text-foreground mb-2">Demo Credentials</h3>
            <div class="text-xs text-muted-foreground space-y-1">
              <p><strong>Email:</strong> test@test.com</p>
              <p><strong>Password:</strong> password</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="text-center mt-6">
        <p class="text-muted-foreground">
          Don't have an account?
          <Button
            variant="link"
            class="text-primary hover:text-primary/80 p-0 h-auto font-medium"
            @click="emit('clickOnRegister')"
          >
            Create one
          </Button>
        </p>
      </div>

      <div class="text-center mt-4">
        <Badge variant="outline" class="bg-card border-border text-card-foreground">
          Demo Mode • Guest Access Available
        </Badge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios, { AxiosError } from 'axios';
import router from '@/router';
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-vue-next';

const emit = defineEmits<{
  clickOnRegister: []
}>();

const errors = ref<{general?: string}>({});
const userStore = useUserStore();

const form = ref({
  email: 'test@test.com',
  password: 'password'
});

const fields = [
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
] as const;

type LaravelValidationErrorResponse = {
  message: string;
  errors: Record<string, string[]>;
};

const submitLogin = async () => {
  errors.value = {};
  try {
    const response = await axios.post('/login', form.value);
    console.log('Login successful:', response.data);

    await userStore.checkAuthStatus();
    router.push('/');

  } catch (err) {
    const error = err as AxiosError<LaravelValidationErrorResponse>
    console.error('Login failed:', error);
    if (error.response && error.response.status === 422) {
      errors.value.general = 'Wrong email or password.';
    } else {
      errors.value.general = 'An unexpected error occurred. Please try again.';
    }
  }
};
</script>
