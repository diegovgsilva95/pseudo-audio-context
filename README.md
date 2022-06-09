# Prova de conceito de AudioContext emulado (PseudoAudioContext)

Esse projeto implementa um ambiente emulado de contexto de áudio (`js/processor/wrapper.mjs`) para que instâncias do tipo `AudioWorkletProcessor` possam ser incorporadas em ambos os ambientes, real (`AudioContext`) ou emulado (`PseudoAudioContext`).

Esse projeto também traz uma classe herdável denominada `EventEmitterAudioWorkletProcessor`.


## Motivação
O parâmetro `sampleRate` do construtor `AudioContext` possibilita apenas valores aceitáveis pelas placas de som, tais como `8000` (8 kHz), `16000` (16 kHz), `44100` (44,1 kHz) e `48000` (48 kHz).
Valores arbitrários como `1000` (1 kHz) serão ignorados, uma vez que a **especificação da API WebAudio** especifica que *"implementações **PRECISAM** suportar taxas de amostragem dentro pelo menos do intervalo entre 8000 e 96000* (Fonte: [Tabela de argumentos para o `BaseAudioContext.createBuffer()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createbuffer))

Para experimentos com ondas de áudio onde é necessário o uso de taxas menores de amostragem (por exemplo, ao testar fórmulas em um domínio contínuo de amostras), torna-se inviável o uso do `AudioContext`. Nesses casos, geralmente são utilizadas outras abordagens para experimentação. Entretanto, é interessante que o código seja facilmente intercambiável entre os dois ambientes, de experimentação e de sonoplastia.

Isso levou à tentativa criação desse ambiente supracitado, ou parte dele, como será possível observar na seção a seguir.

## Ressalvas
O encapsulador (wrapper) implementa apenas algumas características do contexto de áudio, a saber:

- Nenhuma outra interface *Node ou *Event são implementadas, tão somente a interface `AudioWorkletProcessor` é implementada de forma parcial, bem como classes imediatamente de dependência que foram necessárias para os experimentos realizados inicialmente com o ambiente híbrido.
- No `AudioWorkletProcessor`, não são suportados parâmetros. Talvez isso possa ser implementado em um futuro commit ou implementado através de PR (pull request). Sinta-se livre para fazê-lo caso assim desejar, não somente nesse tópico mas em qualquer mudança!
- A conexão do `PseudoWorkletNode` (que imita o original `AudioWorkletNode`) deve ser realizada apenas com o `context.destination`. Não são suportados outros destinos.

Outras ressalvas podem ser observadas no código em si e comparando com a documentação da API WebAudio, disponível no [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).


## EventEmitterAudioWorkletProcessor
De brinde, essa classe permite criar um processador de áudio (seja emulado ou real, podendo ser usado fora e independentemente da prova de conceito) que aceite chamadas de métodos internos ao processador através do `processorNode.port.postMessage`, passando-se o nome do método e seu parâmetro como um conjunto de chaves-valores (JSON).
O uso dessa classe no processador usado como exemplo nesse projeto demonstra, entre outras coisas, como é possível receber mensagens no Worker mesmo quando o sistema de mensageria do Worker é usado pelo encapsulador do ambiente para troca de mensagens entre seus escopos de instanciação e de Worker, como será descrito a seguir. 

## Arquivo de ambiente emulado
O arquivo `wrapper.mjs` trabalha com os dois escopos em um mesmo arquivo: quando importado, exporta as classes necessárias para a construção das classes pseudo-áudio. As etapas de instanciação realizarão a criação de um worker, chamando o mesmo arquivo `wrapper.mjs` (o nome do arquivo e o caminho podem ser alterados pois o arquivo utiliza `import.meta.url` para encontrar a própria URL, algo similar ao `__filename__` do PHP)  dessa vez com escopo de Worker, onde então declara classes substitutas (que não existirão no contexto de Worker e, portanto, tecnicamente não são uma redefinição de métodos nativos) que serão usadas pelo processador a ser importado. 

## Em construção
Mais detalhes e mais correções podem ser acrescentadas a esse projeto por mim ou por qualquer um que queira colaborar. Neste caso, sinta-se livre para submeter um PR. 