import {useEffect, useState} from "react";

/* eslint-disable no-undef */
const recognition = window.webkitSpeechRecognition ? new webkitSpeechRecognition() : null;
/* eslint-enable no-undef */

const useSpeechRecognition = () => {

    // realtime recognized text (fragmented by pauses)
    const [text, setText] = useState("");

    // recognized text from start of listening
    const [fullText, setFullText] = useState("");

    // listening start time
    const [startListeningTime, setStartListeningTime] = useState(null);

    // time of last recognition
    const [textTime, setTextTime] = useState(null);

    // listening status of recognition
    const [isListening, setIsListening] = useState(false);

    // language
    const [lang, setLang] = useState("en-US")

    useEffect(() => {
        if (!recognition) return;
        recognition.lang = lang;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.addEventListener("start", () => {
            setStartListeningTime(Date.now())
        });
        recognition.addEventListener("end", () => {
            // console.log("end listening...", Date.now());
            setIsListening(false);
        });

        recognition.onresult = (event) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + " ";
                } else {
                    interimTranscript += transcript;
                }
            }
            setText(interimTranscript);
            // recognized text from start of listening
            setFullText(fullText + fullText ? " " : "" + finalTranscript);
        };

        return () => {
            recognition.onresult = null;
            recognition.stop();
            setIsListening(false)
        };
    }, []);

    useEffect(() => {
        setTextTime(Date.now())
    }, [text]);

    // start continuous text recognition in lang language
    const startListening = (lang) => {
        if (recognition && !isListening) {

            setText("");
            setFullText("");

            setStartListeningTime(null);
            setTextTime(null);

            setIsListening(true);
            setLang(lang)
            recognition.lang = lang;
            recognition.continuous = true;
            recognition.start();
        }
    };

    // stop text recognition
    const stopListening = () => {
        if (recognition) {
            setIsListening(false);
            recognition.stop();
        }
    };

    return {
        text,
        fullText,
        isListening,
        startListeningTime,
        textTime,
        lang,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition
    };
};

export default useSpeechRecognition;
