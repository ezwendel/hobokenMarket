import React, { useCallback, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ConversationsContext = React.createContext()

export function useConversations() {
    return useContext(ConversationsContext)
}

export function ConversationsProvider({ children }) {
    const [conversations, setConversations] = useLocalStorage('conversations', [])

    function createConversations(recipient) {
        setConversations(prev => {
            return [...prev, { recipient, messages: [] }]
        })
    }

    const sendMessage = useCallback(({ recipient, text, sender }) => {
        setConversations(prev => {
            const message = { sender, text };

        })
    })

    return (
        <ConversationsContext.Provider value={{ conversations, createConversations }}>
            {children}
        </ConversationsContext.Provider>
    )
}

