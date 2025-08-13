import {create} from 'zustand'
import { api } from './../lib/axios';

const authStore = create((set, get) => ({
    user: null,
    set: set,

    setUser : (newUser) =>{
        set({user: newUser})
    },


    checkAuth: async () =>{
        try {
            const response = await api.get('/auth/check-auth');
            if(response) {
                set({user: response.data.user})
                console.log(response.data.user);
            }
        } catch (error) {
            console.log(error);
        }
    }
}))

export default authStore;