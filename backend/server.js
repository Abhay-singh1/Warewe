 const express = require('express')
 const cors  = require('cors')
const tf = require('@tensorflow/tfjs');
const fetch = require('node-fetch')

const app = express()
app.use(cors())


app.get('/:text', (req, res)=>{

    const sentimentText = req.params.text
    console.log(sentimentText.body)


    const SentimentThreshold = {
        Positive: 0.66,
        Neutral: 0.33,
        Negative: 0
    }
    const PAD_INDEX = 0;
    const OOV_INDEX = 2;

    const urls = {
        models: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
        metadatas: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
    };

    let metadata,model;
 
   


    async function setupSentimentModel(){
        if(typeof model === 'undefined'){
            model = await loadModel(urls.models);
        }
        if(typeof metadata === 'undefined'){
            metadata = await loadMetadata(urls.metadatas);
        }
    }


     async function loadModel(url) {
        try {
            const model = await tf.loadLayersModel(url);
            return model;
        } catch (err) {
            console.log(err);
        }
    }
    
    async function loadMetadata(url) {
        try {
            const metadataJson = await fetch(url);
             const metadata = await metadataJson.json();
            return metadata;
        } catch (err) {
            console.log(err);
        }
    }

    function processTextData(texts){
        setupSentimentModel().then(
        result => {
            // const textData = {};
            
                
                const sentiment_score = getSentimentScore(texts);
                let text_sentiment = '';
                if(sentiment_score > SentimentThreshold.Positive){
                    text_sentiment = 'positive'
                }else if(sentiment_score > SentimentThreshold.Neutral){
                    text_sentiment = 'neutral'
                }else if(sentiment_score >= SentimentThreshold.Negative){
                    text_sentiment = 'negative'
                }
                let textData ={
                    sentiment: text_sentiment,
                    score: sentiment_score.toFixed(4),
                    text: texts
                }
            
            res.json(textData);
            
        }
    )   
}

    function padSequences(sequences, maxLen, padding = 'pre', truncating = 'pre', value = PAD_INDEX) {
        return sequences.map(seq => {
            if (seq.length > maxLen) {
                if (truncating === 'pre') {
                    seq.splice(0, seq.length - maxLen);
                } else {
                    seq.splice(maxLen, seq.length - maxLen);
                }
            }

            if (seq.length < maxLen) {
                const pad = [];
                for (let i = 0; i < maxLen - seq.length; ++i) {
                    pad.push(value);
                }
                if (padding === 'pre') {
                    seq = pad.concat(seq);
                } else {
                    seq = seq.concat(pad);
                }
            }

            return seq;
  });
}
 
    function getSentimentScore(text) {
        console.log(text)
        const inputText = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
        // Convert the words to a sequence of word indices.
        const sequence = inputText.map(word => {
        let wordIndex = metadata.word_index[word] + metadata.index_from;
        if (wordIndex > metadata.vocabulary_size) {
            wordIndex = OOV_INDEX;
        }
        return wordIndex;
        });
        // Perform truncation and padding.
        const paddedSequence = padSequences([sequence], metadata.max_len);
        const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);

        const predictOut = model.predict(input);
        const score = predictOut.dataSync()[0];
        predictOut.dispose();

        return score;
    }

    processTextData(sentimentText)
})


 app.listen(5000,()=>{
    console.log('Server Started')
 })