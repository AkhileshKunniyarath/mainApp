import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (email.trim() !== '' && password.trim() !== '') {
      await firestore()
        .collection('users')
        .where('email', '==', email.trim().toLocaleLowerCase())
        .get()
        .then(async snapshot => {
          if (snapshot.empty) {
            Snackbar.show({
              text: 'This user is not registered with us, try creating a new account.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
              textColor: 'white',
            });
          } else {
            snapshot.forEach(documentSnapshot => {
              const respData = documentSnapshot.data();
              if (password.trim() === respData.password) {
                if (!respData?.active) {
                  // Blocked user case
                  Snackbar.show({
                    text: 'Your account is blocked. Contact support.',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                    textColor: 'white',
                  });
                } else {
                  // Successful login for active user
                  Snackbar.show({
                    text: 'Login successful',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'green',
                    textColor: 'white',
                  });
                  // Navigate to Home Screen
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  });
                }
              } else {
                Snackbar.show({
                  text: 'The password you entered is wrong.',
                  duration: Snackbar.LENGTH_LONG,
                  backgroundColor: 'red',
                  textColor: 'white',
                });
              }
            });
          }
        })
        .catch(err => console.warn(err));
    } else {
      Snackbar.show({
        text: 'Fill up the fields to continue',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
        textColor: 'white',
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={'gray'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'gray'}
        // secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 15,
    color: '#007bff',
    fontSize: 16,
  },
});

export default Login;
