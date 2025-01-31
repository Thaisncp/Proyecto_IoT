import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Slide } from 'react-awesome-reveal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PeticionGet } from '../hooks/Conexion';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputContent, setInputContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const apiKey = "AIzaSyAZBcV7iX4gBGB6WjhoBJaKEuLtnb2efhs"; // Reemplaza con tu API key
    const mensajesRef = useRef(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const sugerencias = [
        "¿Cuál es el último dato de ruido?",
        "¿Cuál es el promedio del día?",
        "¿Cuál es el promedio de la semana?",
        "¿Cuál es la predicción de ruido?",
        "¿Cómo se mide el ruido?",
        "¿Cuáles son los niveles seguros de ruido?",
        "¿Qué efectos tiene el ruido en la salud?",
        "¿Cómo puedo reducir el ruido en mi entorno?"
    ];

    const handleSugerenciaClick = (sugerencia) => {
        setInputContent(sugerencia);
    };

    const handleInputChange = (e) => {
        setInputContent(e.target.value);
    };

    const runModel = async () => {
        if (!apiKey) {
          console.error('Por favor, ingrese la api key');
          return;
        }
      
        setIsGenerating(true);
      
        // Verificar si la pregunta es sobre datos de ruido
        if (
          inputContent.toLowerCase().includes('último dato de ruido') ||
          inputContent.toLowerCase().includes('promedio del día') ||
          inputContent.toLowerCase().includes('promedio de la semana') ||
          inputContent.toLowerCase().includes('predicción')
        ) {
          try {
            let endpoint = '';
            let mensajeRespuesta = '';
      
            // Determinar el endpoint según la pregunta
            if (inputContent.toLowerCase().includes('último dato de ruido')) {
              endpoint = 'ultimo';
              mensajeRespuesta = 'El último dato de ruido registrado es:';
            } else if (inputContent.toLowerCase().includes('promedio del día')) {
              endpoint = 'datos/dia';
              mensajeRespuesta = 'El promedio de ruido del día es:';
            } else if (inputContent.toLowerCase().includes('promedio de la semana')) {
              endpoint = 'datos/semana';
              mensajeRespuesta = 'El promedio de ruido de la semana es:';
            } else if (inputContent.toLowerCase().includes('predicción')) {
              endpoint = 'datos';
              mensajeRespuesta = 'La predicción de ruido para las próximas horas es:';
            }
      
            // Hacer la petición GET
            const response = await PeticionGet("", endpoint); // Usa tu hook PeticionGet
            const data = response.info; // Acceder a los datos
      
            if (data) {
              let resultado = '';
      
              if (inputContent.toLowerCase().includes('promedio del día')) {
                // Calcular promedio del día (info es un array)
                const promedio = calcularPromedio(data);
                resultado = `${promedio} dB`;
              } else if (inputContent.toLowerCase().includes('promedio de la semana')) {
                // Calcular promedio de la semana (info es un array)
                const promedio = calcularPromedio(data);
                resultado = `${promedio} dB`;
              } else if (inputContent.toLowerCase().includes('predicción')) {
                // Generar predicción (info es un array)
                const prediccion = generarPrediccion(data);
                resultado = `${prediccion} dB`;
              } else {
                // Último dato (info es un objeto)
                if (data.dato) {
                  resultado = `${data.dato} dB (${data.fecha} ${data.hora})`;
                } else {
                  resultado = 'No se encontró el último dato.';
                }
              }
      
              setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'question', content: inputContent },
                { type: 'answer', content: `${mensajeRespuesta} ${resultado}` },
              ]);
            } else {
              setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'question', content: inputContent },
                { type: 'answer', content: 'No se encontraron datos.' },
              ]);
            }
          } catch (error) {
            console.error('Error al consultar el backend:', error);
            setMessages((prevMessages) => [
              ...prevMessages,
              { type: 'question', content: inputContent },
              { type: 'answer', content: 'Hubo un error al consultar los datos de ruido.' },
            ]);
          } finally {
            setIsGenerating(false);
            setInputContent('');
            return;
          }
        }
      
        // Si no es una pregunta sobre datos, usar la IA de Gemini
        const isGreeting = checkIfGreeting(inputContent);
        if (isGreeting) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'answer', content: '¡Hola! Soy un chatbot diseñado para proporcionarte información sobre el monitoreo de ruido. ¿Qué te gustaría saber hoy?' },
          ]);
          setIsGenerating(false);
          setInputContent('');
          return;
        }
      
        const isRelatedToNoise = checkIfRelatedToNoise(inputContent);
      
        try {
          let text;
      
          if (isRelatedToNoise) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
            // Limitar la respuesta a 50 palabras
            const prompt = `${inputContent} (limit: 50 words)`;
      
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = await response.text();
      
            text = text.replace(' (limit: 50 words)', '');
          } else {
            text = generateOptionsForNoise();
          }
      
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'question', content: inputContent },
            { type: 'answer', content: text },
          ]);
          setInputContent('');
      
        } catch (error) {
          console.error('Error al generar contenido:', error);
        } finally {
          setIsGenerating(false);
        }
      };
      
      // Función para calcular el promedio
      const calcularPromedio = (datos) => {
        if (!datos || datos.length === 0) return 0;
        const suma = datos.reduce((acc, dato) => acc + parseFloat(dato.dato), 0);
        return (suma / datos.length).toFixed(2); // Redondear a 2 decimales
      };
      
      // Función para generar una predicción (ejemplo simple: promedio móvil)
      const generarPrediccion = (datos) => {
        if (!datos || datos.length === 0) return 0;
        const ultimosDatos = datos.slice(-10); // Usar los últimos 10 datos
        const promedio = calcularPromedio(ultimosDatos);
        return promedio;
      };

    const checkIfRelatedToNoise = (question) => {
        const noiseKeywords = ['ruido', 'decibelios', 'niveles de ruido', 'contaminación acústica', 'sonómetro', 'salud auditiva', 'reducción de ruido'];
        return noiseKeywords.some(keyword => question.toLowerCase().includes(keyword.toLowerCase()));
    };

    const checkIfGreeting = (question) => {
        const greetings = ['hola', 'cómo estas', 'buenos dias', 'buenas tardes', 'buenas noches'];
        return greetings.some(greeting => question.toLowerCase().includes(greeting.toLowerCase()));
    };

    const generateOptionsForNoise = () => {
        return "¡ NO ENTIENDO TU PREGUNTA !";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputContent.trim() === '') {
            toast.warning('Por favor, escribe una pregunta.');
            return;
        }
        runModel();
    };

    const handleLimpiarChat = () => {
        setMessages([]);
    };

    useEffect(() => {
        if (mensajesRef.current) {
            mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
        }
    }, [messages]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div>
            {/* Botón flotante */}
            <button
                onClick={toggleChat}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    backgroundColor: 'var(--azul)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <i className="fa fa-commenting" aria-hidden="true"></i> {/* Ícono de comentario */}
            </button>

            {/* Modal del chatbot */}
            {isChatOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        zIndex: 1001,
                        borderRadius: '12px',
                        width: '500px',
                        height: '650px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <h2 style={{ margin: 0, alignContent: "center" }}>Chatbot</h2>
                    </div>

                    <div
                        ref={mensajesRef}
                        style={{
                            flex: 1,
                            padding: '10px',
                            overflowY: 'auto',
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        {messages.map((message, index) => (
                            <Slide key={index} direction={message.type === 'question' ? 'left' : 'right'} triggerOnce>
                                <div
                                    style={{
                                        marginBottom: '10px',
                                        textAlign: message.type === 'question' ? 'right' : 'left'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            backgroundColor: message.type === 'question' ? 'var(--azul)' : 'var(--gris)',
                                            color: message.type === 'question' ? 'white' : 'black'
                                        }}
                                    >
                                        <p style={{ margin: 0 }}>{message.content}</p>
                                    </div>
                                </div>
                            </Slide>
                        ))}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            padding: '10px',
                            borderTop: '1px solid #ddd',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center'
                        }}
                    >
                        <input
                            type="text"
                            value={inputContent}
                            onChange={handleInputChange}
                            placeholder="Escribe tu pregunta..."
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isGenerating}
                            style={{
                                padding: '10px',
                                backgroundColor: 'white',
                                color: 'var(--azul)',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <i className="fas fa-paper-plane" aria-hidden="true"></i> {/* Ícono de enviar */}
                        </button>
                    </form>

                    <div
                        style={{
                            padding: '10px',
                            borderTop: '1px solid #ddd',
                            overflowY: 'auto', // Hacer desplazable
                            maxHeight: '250px' // Altura máxima para el contenedor
                        }}
                    >
                        <h3 style={{ margin: 0, marginBottom: '10px' }}>Preguntas frecuentes</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {sugerencias.map((sugerencia, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSugerenciaClick(sugerencia)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: 'var(--gris)',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sugerencia}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleLimpiarChat}
                        style={{
                            padding: '10px',
                            backgroundColor: 'var(--rojo)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0 0 12px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                        }}
                    >
                        <i className="fa fa-eraser" aria-hidden="true"></i> {/* Ícono de borrar */}
                    </button>
                </div>
            )}

            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default ChatBot;