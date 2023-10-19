import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const { name, color, userID } = route.params;

    //create a messages state
    const [messages, setMessages] = useState([]);

    let unsubMessages;

    //a simulated user message and the new system message
    useEffect(() => {
        navigation.setOptions({ title: name });
        if (isConnected === true) {
            console.log('if')
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
        } else {
            loadCachedMessages();
            console.log('else')
        }

        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, [isConnected]);

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        console.log('cachedMessages', cachedMessages);
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

    const renderInputToolbar = (props) => {
        if (isConnected === true) return <InputToolbar {...props} />;
        else return null;
    };

    //allows you to alter how message bubbles are displayed
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

    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} {...props} />;
    };

    const renderCustomView = (props) => {
        const { currentMessage} = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={message => onSend(message)}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                user={{
                    _id: userID,
                    name: name,
                }}
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
    logoutButton: {
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: "#C00",
        padding: 10,
        zIndex: 1
    },
    logoutButtonText: {
        color: "#FFF",
        fontSize: 10
    }
});

export default Chat;