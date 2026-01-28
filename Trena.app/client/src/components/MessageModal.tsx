import React from 'react';

// Placeholder hook
export function useSendMessage() {
    return {
        sendMessage: (vars: { receiverId: number | null; content: string }) => {
            console.log("Sending message...", vars);
        }
    };
}

// Placeholder component
const MessageModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    onSendMessage: (message: string) => void;
}> = ({ isOpen, onClose, recipientName, onSendMessage }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                <h2>Enviar mensagem para {recipientName}</h2>
                <p>Componente de modal de mensagem em breve.</p>
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

export default MessageModal;
