module.exports = {
    globals: {
        speechSynthesis: {
            getVoices: ()=>{
                return [{name: 'en-US'}]
            },
            speak: ()=> {}
        },
        fetch: ()=>{ },
        SpeechSynthesisUtterance: class {}
    }
}