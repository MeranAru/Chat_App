// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

//importing firestore database
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const App = () => {

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD066RtevfsjLWCvKSZ5FGmPuKjyN9YNg0",
    authDomain: "chatapp-ac3e9.firebaseapp.com",
    projectId: "chatapp-ac3e9",
    storageBucket: "chatapp-ac3e9.appspot.com",
    messagingSenderId: "253472736419",
    appId: "1:253472736419:web:617f71bf86eff5175b2b16"
  };
  // initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          {...props => <Chat db={db} {...props} />}
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;