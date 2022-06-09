import EventEmitterAudioWorkletProcessor from "./processor-base.mjs";

registerProcessor("test-processor", class extends EventEmitterAudioWorkletProcessor {
    constructor(options){
        super();
        console.log("Inicio", {sampleRate, currentFrame, currentTime});

        this.sample = new Float32Array(128);
    }
    helloWorld(text){ // Exemplo de método chamável por postMessage
        console.log(text)
    }
    processSample(frame){
        return Math.random() * 0.25;
    }
    process(inputs, [output], parameters){
        console.log("Processando", currentFrame)
        for(let i in this.sample)
            this.sample[i] = this.processSample((+i)+currentFrame);

        for(let channel of output)
            channel.set(this.sample);

        return true;
    }
});

