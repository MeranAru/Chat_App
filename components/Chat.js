import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { StyleSheet, View, Text, KeyboardAvoidingView, FlatList } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
    const { name, color, userID } = route.params;

    //create a messages state
    const [messages, setMessages] = useState([]);

    let unsubMessages;

    //a simulated user message and the new system message
    useEffect(() => {
        navigation.setOptions({ title: name });
        if (isConnected === true) {
            // unregister current onSnapshot() listener to avoid registering multiple listeners when
            // useEffect code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;
            unsubMessages = onSnapshot(
                query(collection(db, "messages"), orderBy("createdAt", "desc")),
                (documentsSnapshot) => {
                    let newMessages = [];
                    documentsSnapshot.forEach((doc) => {
                    // shape the messages to match what gifted chat expects
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis()),
                    });
                });
                cacheMessages(newMessages);
                setMessages(newMessages);
                }
            );
        } else loadCachedMessages();

        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, [isConnected]);

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }
    
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    //called the onSend()
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
    }

    //llows you to alter how message bubbles are displayed
    const renderBubble = (props) => {
        return (<Bubble
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
        );
    };

    const renderInputToolbar = (props) => {
        if (isConnected) {
            return <InputToolbar {...props} />;
        } else {
            return null;
        }
    };
    

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
                renderInputToolbar={renderInputToolbar}
            />
            {/*{<FlatList
                data={messages}
                renderItem={({ message }) =>
                <Text>{message.name}: {message.messages.join(", ")}</Text>}
            />}*/}
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
            <Text>Hello User!</Text>
        </View>
    );
}
    //styleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;