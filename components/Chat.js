import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { StyleSheet, View, Text, KeyboardAvoidingView, FlatList } from 'react-native';

const Chat = ({ route, navigation, db }) => {
    const { name, color, userID } = route.params;

    //create a messages state
    const [messages, setMessages] = useState([]);

    //a simulated user message and the new system message
    useEffect(() => {
        navigation.setOptions({ title: name });
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (docs) => {
            let newMessages = [];
            docs.forEach(doc => {
                newMessages.push({
                id: doc.id,
                ...doc.data(),
                createdAt: new Date(doc.data().createdAt.toMillis())
                })
            })
            setMessages(newMessages);
        })
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);

    //called the onSend()
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
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
        <View style={[styles.container, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                onSend={message => onSend(message)}
                user={{
                    _id: userID,
                    name: name,
                }}
                renderBubble={renderBubble}
            />
            <FlatList
                data={messages}
                renderItem={({ message }) =>
                <Text>{message.name}: {message.messages.join(", ")}</Text>}
            />
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
            <Text>Hello User!</Text>
        </View>
    );
}
    //styleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#474056'
    },
});

export default Chat;