import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allMessages: [],
    allParticipants: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    getAllMessages(state, action) {
      state.allMessages = action.payload.allMessages
    },
    getAllParticipants(state, action) {
      state.allParticipants = action.payload.allParticipants;
      state.allMessages.forEach(message => {
        const participant = action.payload.allParticipants.find(participant => participant.uuid === message.authorUuid)
        if(participant){
          message.avatarUrl = participant.avatarUrl
          message.name = participant.name
          message.bio = participant.bio
          message.email = participant.email
          message.jobTitle = participant.jobTitle
        }

        if(message.sentAt !== message.updatedAt) message.edited = true
        else message.edited = false

        if(message.replyToMessage){
          const participant = action.payload.allParticipants.find(participant => participant.uuid === message.replyToMessage.authorUuid)
          if(participant){
            message.replyToMessage.name = participant.name
          }
        }

        if(message.reactions.length){
          action.payload.allParticipants.forEach(participant => {
            message.reactions.forEach(reaction => {
              if(reaction.participantUuid === participant.uuid){
                reaction.avatarUrl = participant.avatarUrl
                reaction.name = participant.name
              }
            })
          })
        }
      })
    },
  }
})

export const { getAllMessages: getAllMessagesAction, getAllParticipants: getAllParticipantsAction } = messagesSlice.actions
export default messagesSlice.reducer