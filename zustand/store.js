import { create } from 'zustand'

export const useStore = create((set) => ({
  allMessages: [],
  allParticipants: [],
  isLoading: true,
  getAllMessages: (payload) => set({allMessages: payload.allMessages}),
  toggleLoading: (payload) => set({isLoading: payload.isLoading}),
  getAllParticipants: (payload) => {
    set((state) => {
      const updatedMessages = state.allMessages.map(message => {
        // Find participant for the message
        const participant = payload.allParticipants.find(participant => participant.uuid === message.authorUuid);
    
        // Map participant
        const updatedMessage = {
          ...message,
          ...(participant && {
            avatarUrl: participant.avatarUrl,
            name: participant.name,
            bio: participant.bio,
            email: participant.email,
            jobTitle: participant.jobTitle,
          }),
          edited: message.sentAt !== message.updatedAt, // if the message was edited
        };
    
        // Map replyToMessage
        if(message.replyToMessage){
          const participant = payload.allParticipants.find(participant => participant.uuid === message.replyToMessage.authorUuid);
          updatedMessage.replyToMessage = {
            ...message.replyToMessage,
            ...(participant && { name: participant.name }),
          };
        }
    
        // Map reactions
        if(message.reactions?.length){
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
            
      return {allParticipants: payload.allParticipants, allMessages: updatedMessages, isLoading: false }
    });
  },
}))
