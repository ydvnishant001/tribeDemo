import { create } from 'zustand'

export const useStore = create((set) => ({
  allMessages: [],
  allParticipants: [],
  getAllMessages: (payload) => {
    set((state) => {
      // console.log(state.allMessages, payload.allMessages);
      return {allMessages: payload.allMessages}
    })
    
  },
  getAllParticipants: (payload) => {
    set((state) => {
      const updatedMessages = state.allMessages.map(message => {
        // Find participant for the message author
        const participant = payload.allParticipants.find(participant => participant.uuid === message.authorUuid);
    
        // Map author details if found
        const updatedMessage = {
          ...message,
          ...(participant && {
            avatarUrl: participant.avatarUrl,
            name: participant.name,
            bio: participant.bio,
            email: participant.email,
            jobTitle: participant.jobTitle,
          }),
          edited: message.sentAt !== message.updatedAt, // Determine if the message was edited
        };
    
        // Map replyToMessage details if present
        if (message.replyToMessage) {
          const participant = payload.allParticipants.find(participant => participant.uuid === message.replyToMessage.authorUuid);
          updatedMessage.replyToMessage = {
            ...message.replyToMessage,
            ...(participant && { name: participant.name }),
          };
        }
    
        // Map reactions if present
        if (message.reactions?.length) {
          updatedMessage.reactions = message.reactions.map(reaction => {
            const participant = payload.allParticipants.find(participant => participant.uuid === reaction.participantUuid);
            return {
              ...reaction,
              ...(participant && {
                avatarUrl: participant.avatarUrl,
                name: participant.name,
              }),
            };
          });
        }
    
        return updatedMessage;
      });
            
      return {allParticipants: payload.allParticipants, allMessages: updatedMessages}
    });
    // set((state) => {allMessages: 

    // });
    

    // console.log(updatedMessages);
    

    // allMessages.forEach(message => {
    //   const participant = action.payload.allParticipants.find(participant => participant.uuid === message.authorUuid)
      
    //   if(participant){
    //     message.avatarUrl = participant.avatarUrl
    //     message.name = participant.name
    //     message.bio = participant.bio
    //     message.email = participant.email
    //     message.jobTitle = participant.jobTitle
    //   }

    //   if(message.sentAt !== message.updatedAt) message.edited = true
    //   else message.edited = false

    //   if(message.replyToMessage){
    //     const participant = action.payload.allParticipants.find(participant => participant.uuid === message.replyToMessage.authorUuid)
    //     if(participant){
    //       message.replyToMessage.name = participant.name
    //     }
    //   }

    //   if(message.reactions.length){
    //     action.payload.allParticipants.forEach(participant => {
    //       message.reactions.forEach(reaction => {
    //         if(reaction.participantUuid === participant.uuid){
    //           reaction.avatarUrl = participant.avatarUrl
    //           reaction.name = participant.name
    //         }
    //       })
    //     })
    //   }
    // })
  },
}))
