import { createContext, useState } from "react";
import run from '../config/gemini';

export const Context = createContext()

const ContextProvider = (props) => {

    const [input, setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompts, setPrevPrompts] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let result;
        if(prompt !== undefined){
            result = await run(prompt)
            setRecentPrompt(prompt)
        }else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            result = await run(input)
        }
        
        let responseArray = result.split("**")
        console.log(responseArray)
        let newResponse = "";
        for(let i = 0; i < responseArray.length ; i++){
            if(i%2===0){
                newResponse += responseArray[i];
            }else{
                newResponse += "<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponseFinal = newResponse.split("*").join("</br></br>")
        setResultData(newResponseFinal)
        setLoading(false)
        setInput("")
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return(
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider