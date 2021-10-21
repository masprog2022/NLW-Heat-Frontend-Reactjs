import { api } from '../../services/api'
import io, { Socket } from 'socket.io-client'
import styles from './styles.module.scss'
import ImgLogo from '../../assets/logo.svg'
import { useEffect, useState } from 'react'

type Message = {

  id: string
  text: string
  user: {
    name: string
    avatar_url: string
  }

}

const messageQueue: Message[] = []

const socket = io('http://localhost:4000')

socket.on('new_message', (newMessage: Message) =>{
  //console.log(newMessage)

  messageQueue.push(newMessage)
})

export function MessageList() {

  const [messages, setMessages] = useState<Message[]>([],)

  useEffect(()=> {
    const timer = setInterval(()=>{
      if(messageQueue.length > 0){
        setMessages(prevState => [
          messageQueue[0],
          prevState[0],
          prevState[1]

        ].filter(Boolean))
        
        messageQueue.shift()

      } 
    }, 3000)
  }, [])

  useEffect(() => {
    // chamada a api, para buscar os dados
    api.get<Message[]>('messages/last3').then(response => {
      // console.log(response.data);
      setMessages(response.data);
    })
  }, [])


  return (
    <div className={styles.messageListWrapper}>
      <img src={ImgLogo} alt="Dowhile 2021" />

      <ul className={styles.messageList}>

        {
          messages.map(message => {
            return (

              <li key={message.id} className={styles.message}>
                <p className={styles.messageContent}>{message.text}</p>
                <div className={styles.messageUser}>
                  <div className={styles.userImage}>
                    <img src={message.user.avatar_url} alt={message.user.name} />
                  </div>

                  <span>{message.user.name}</span>
                </div>
              </li>
            );
          })
        }

      </ul>
    </div>
  )
}