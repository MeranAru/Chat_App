import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';

const image = require('../media/images/background-image.png')
const backgroundColors = {
    a: '#090C08',
    b: '#474056',
    c: '#8A95A5',
    d: '#B9C6AE',
};

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState(backgroundColors.d);
    
    return (
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Text style={styles.text}>Hello User!</Text>
                <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder='Type your username here'
                />
                <View style={styles.colorSelector}>
                    <TouchableOpacity
                    style={[
                        styles.circle,
                        color === backgroundColors.a && styles.selectedCircle,
                        { backgroundColor: backgroundColors.a },
                    ]}
                    onPress={() => setColor(backgroundColors.a)}
                    ></TouchableOpacity>
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
                    ></TouchableOpacity>
                    <TouchableOpacity
                    style={[
                        styles.circle,
                        color === backgroundColors.d && styles.selectedCircle,
                        { backgroundColor: backgroundColors.d },
                    ]}
                    onPress={() => setColor(backgroundColors.d)}
                    ></TouchableOpacity>
                </View>
                <Button
                title="Go to Chat"
                onPress={() => navigation.navigate('Chat', { name: name})}
                />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        padding: '6%',
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