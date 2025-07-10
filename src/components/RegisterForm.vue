<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-xl">P</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Create Account</h1>
        <p class="text-muted-foreground">Join Plinko Game and start playing</p>
      </div>

      <Card class="backdrop-blur-sm">
        <CardContent class="p-6">
          <form @submit.prevent="submitRegister" class="space-y-4">
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
                  :class="[
                    'bg-input border-border text-foreground placeholder:text-muted-foreground',
                    'focus:border-ring focus:ring-ring/20',
                    errors[field.name] ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
                  ]"
                  :placeholder="`Enter your ${field.label.toLowerCase()}`"
                />
                <div v-if="errors[field.name]" class="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle class="w-4 h-4" />
                  {{ errors[field.name]?.[0] }}
                </div>
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
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>

      <div class="text-center mt-6">
        <p class="text-muted-foreground">
          Already have an account?
          <Button
            variant="link"
            class="text-primary hover:text-primary/80 p-0 h-auto font-medium"
            @click="emit('clickOnLogin')"
          >
            Sign in
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
import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-vue-next';

const emit = defineEmits<{
  clickOnLogin: []
}>();

const userStore = useUserStore();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'password_confirmation', label: 'Confirm Password', type: 'password' },
] as const;

type FieldName = typeof fields[number]['name'];

type RegisterErrors = Partial<Record<FieldName | 'general', string[] | string>>;

const errors = ref<RegisterErrors>({});

type LaravelValidationErrorResponse = {
  message: string;
  errors: Record<string, string[]>;
};

const submitRegister = async () => {
  errors.value = {};
  try {
    await axios.post('/register', form.value);
    await userStore.checkAuthStatus();
    router.push('/');
  } catch (err) {
    const error = err as AxiosError<LaravelValidationErrorResponse>;
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      errors.value.general = 'An unexpected error occurred. Please try again.';
    }
  }
};
</script>
