import { useState } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { ImageBackground, StyleSheet, View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, Alert } from 'react-native';

const image = require('../media/images/background-image.png')
const backgroundColors = {
    a: '#090C08',
    b: '#474056',
    c: '#8A95A5',
    d: '#B9C6AE',
};

const Start = ({ navigation }) => {
    const auth = getAuth();
    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    const signInUser = () => {
        signInAnonymously(auth)
        .then(result => {
            navigation.navigate('Chat', {
                userID: result.user.uid,
                name: name,
                color: color,
            });
            Alert.alert("Signed in Successfully!");
        })
        .catch((error) => {
            Alert.alert('Unable to sign in, try later again.');
        });
    };
    
    return (
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Text style={styles.appTitle}>Hello User!</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder='Type your username here'
                    />
                    <Text style={styles.textColorSelector}>Choose background color:</Text>
                    <View style={styles.colorSelector}>
                        <TouchableOpacity
                        style={[
                            styles.circle,
                            color === backgroundColors.a && styles.selectedCircle,
                            { backgroundColor: backgroundColors.a },
                        ]}
                        onPress={() => setColor(backgroundColors.a)}
                        >
                            <View style={{backgroundColor:backgroundColors.a}}></View>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={[
                            styles.circle,
                            color === backgroundColors.b && styles.selectedCircle,
                            { backgroundColor: backgroundColors.b },
                        ]}
                        onPress={() => setColor(backgroundColors.b)}
                        ></TouchableOpacity>
                        <TouchableOpacity
                        style={[
                            styles.circle,
                            color === backgroundColors.c && styles.selectedCircle,
                            { backgroundColor: backgroundColors.c },
                        ]}
                        onPress={() => setColor(backgroundColors.c)}
                        >
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={[
                            styles.circle,
                            color === backgroundColors.d && styles.selectedCircle,
                            { backgroundColor: backgroundColors.d },
                        ]}
                        onPress={() => setColor(backgroundColors.d)}
                        ></TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={signInUser}>
                        <Text>Start chatting</Text>
                    </TouchableOpacity>
                </View>
                {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView behavior="padding" />
                ) : null}
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        padding: '6%',
    },
    appTitle: {
        fontWeight: "600",
        fontSize: 45,
        marginBottom: 100
    },
    inputContainer: {
        flex: 1,
        padding: '6%',
        flexBasis: 160,
    },
    colorSelector: {
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    circle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginTop: 10,
        marginBottom: 10,
    },
    selectedCircle: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#757083',
        padding: 10,
    },
});

export default Start;