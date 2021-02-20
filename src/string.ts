export default {
    isQuestion: (str :string)=>{
        return str.includes('who') || 
            str.includes('what') ||
            str.includes('why') ||
            str.includes('where') ||
            str.includes('when') ||
            str.includes('is it') ||
            str.includes('are you') ||
            str.includes('am i') ||
            str.includes('am i') 
    }
}