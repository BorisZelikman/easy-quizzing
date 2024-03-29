import {useEffect, useState} from "react";
import useSpeechRecognition from "./useSpeechRecognition";

const useWaitingForAnswer = () => {
    // using speech-to-text hook
    const {
        text, fullText,
        startListeningTime, textTime,
        startListening, stopListening, isListening, hasRecognitionSupport
    } = useSpeechRecognition()

    // recognized text should contain expected text
    const [expectedText, setExpectedText] = useState(null);

    // isDone means that the expected text has been spoken
    const [isDone, setIsDone] = useState(false);

    // list of verbal commands to control the process
    const [commandList, setCommandList] = useState(
        ["enough stop it", "ну хватит уже", "נו כבר מספיק"]
    );

    // command contained in the spoken text
    const [spokenCommand, setSpokenCommand] = useState("");

    // if expected text wasn't found in waitingTimeLimit waiting should be stopped
    const [timeoutDuration, setTimeoutDuration] = useState(60000);

    let  timeoutId= null
    useEffect(() => {
        // checking for expectedText in recognized text
        if (expectedText &&
            text.toLowerCase().includes(expectedText)||fullText.toLowerCase().includes(expectedText)) {
            setIsDone(true);
            stopWaiting()
        }
        else {
            // checking for verbal commands in recognized text
            commandList.some(command => {
                if (text.toLowerCase().includes(command) || fullText.toLowerCase().includes(command)) {
                    setSpokenCommand(command);
                    stopWaiting()
                    return true;
                }
            });
        }
    }, [text, fullText]);

    // start waiting for expectedText or command in text or timeout
    const startWaitingForAnswer = (expectedText, lang) => {
        setIsDone(false);
        setSpokenCommand("");
        setExpectedText(expectedText)
        startListening(lang)

        // auto stop after timeoutDuration, ms
        timeoutId = setTimeout(() => {
            stopWaiting();
        }, timeoutDuration);
    };

    // stop text recognition
    const stopWaiting = () => {
         clearTimeout(timeoutId);
//         setExpectedText(null)
         stopListening();
    };

    return {
        // from useSpeechRecognition:
        text, fullText,
        startListeningTime, textTime,
        startListening, stopListening, isListening, hasRecognitionSupport,

        expectedText,
        isDone,
        spokenCommand,
        startWaitingForAnswer,
        stopWaiting,
        setCommandList,
        setTimeoutDuration,
    };
};

export default useWaitingForAnswer;
