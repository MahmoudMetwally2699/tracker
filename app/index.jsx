import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import { Link, useRouter } from 'expo-router'; // Import Link and useRouter
import { useSession } from '../ctx';

export default function LoginScreen() {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
  const { signIn, isLoading } = useSession(); // Use signIn from useSession
  const router = useRouter(); // Initialize useRouter

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
      const success = await signIn(email.value, password.value); // Call signIn with email and password
      if (success) {
        router.replace('(tabs)');
      }else{
        setErrorMessage('Invalid email or password. Please try again.'); // Set error message
      }
    
  };

  return (
    <Background>
      <Logo />
      <Header>Welcome back.</Header>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
  
      <Button mode="contained" onPress={onLoginPressed} loading={isLoading}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <Link href="/register" style={styles.link}>
          Sign up
        </Link>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});
