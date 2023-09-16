import { useState, useEffect } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';

const Chat = ({ route, navigation }) => {
    const { name, color } = route.params;

    //create a messages state
    const [messages, setMessages] = useState([]);

    //a simulated user message and the new system message
    useEffect(() => {
        navigation.setOptions({ title: name })
        setMessages([
            {
                _id: 1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ])
    }, []);

    //called the onSend()
    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    }
    //llows you to alter how message bubbles are displayed
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    }

    return (
        <View style={[styles.container]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1
                }}
            />
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
            { Platform.OS === 'iphone' ? <KeyboardAvoidingView behavior="padding" /> : null }
            <Text>Hello User!</Text>
        </View>
    );
}
    //styleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default Chat;