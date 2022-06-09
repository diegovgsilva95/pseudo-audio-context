
import {PseudoWorkletNode, PseudoAudioContext} from "./processor/wrapper.mjs";

let audioMode = 0; // Troque para 1 e o contexto será de áudio, troque para 0 e o contexto será emulado. 
// O código de nodo processador de áudio é o mesmo para ambos, mudando apenas qual classe está sendo puxada do escopo global do Worker.

console.log("%cModo: " + (audioMode ? "Áudio" : "Pseudo"), "font-weight: bold; font-size: 1.2em");

const ctx = new (audioMode ? AudioContext : PseudoAudioContext)({
    sampleRate: 8000
});
await ctx.audioWorklet.addModule("./js/processor/index.mjs");
const procNode = new (audioMode ? AudioWorkletNode : PseudoWorkletNode)(ctx, "test-processor", {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2]
})
procNode.connect(ctx.destination)
procNode.port.postMessage({ 
    helloWorld: "Hello World!"
})
console.log(ctx)
