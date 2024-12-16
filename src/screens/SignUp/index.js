import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (
      name.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() &&
      cpassword.trim()
    ) {
      if (password.trim() === cpassword.trim()) {
        await firestore()
          .collection('users')
          .where('name', '==', name.trim())
          .where('email', '==', email.trim())
          .get()
          .then(async snapshot => {
            if (snapshot.empty) {
              const userData = {
                active: true,
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
                created: String(new Date()),
                updated: String(new Date()),
                active: 1,
              };
              await firestore()
                .collection('users')
                .add(userData)
                .then(resp => {
                  console.warn(resp);
                  Snackbar.show({
                    text: 'Signin successful',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: "green",
                    textColor: "white",
                  });
                  navigation.navigate('Home');
                })
                .catch(err => {
                  console.warn(err);
                });
            } else {
              Snackbar.show({
                text: 'This email is already exist, try using an other or go to login ',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: "red",
                textColor: 'white',
              });
            }
          });
      } else {
        setError('Given passwords are not matching');
      }
    } else {
      setError('Fill up all the fields to continue');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={'gray'}
        value={name}
        onChangeText={setName}
      />

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
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor={'gray'}
        // secureTextEntry
        value={cpassword}
        onChangeText={setCpassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
});

export default SignUp;
