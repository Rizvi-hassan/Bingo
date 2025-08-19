import {create} from 'zustand'

const gameStore = create((set, get) => ({
    socket: null,
    room: null,
    bingoAnimated: false,
    set: set,

    setRoom: (newRoom) =>{
        set({room: newRoom})
    }

}))

export default gameStore;