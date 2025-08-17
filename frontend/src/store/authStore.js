import {create} from 'zustand'
import { api } from './../lib/axios';

const authStore = create((set, get) => ({
    user: null,
    set: set,
    isCheckingAuth: false,

    setUser : (newUser) =>{
        set({user: newUser})
    },


    checkAuth: async () =>{
        set({isCheckingAuth: true})
        try {
            const response = await api.get('/auth/check-auth');
            if(response) {
                set({user: response.data.user})
                console.log(response.data.user);
            }
        } catch (error) {
            console.log(error);
        } finally {
            set({isCheckingAuth: false})
        }
    }
}))

export default authStore;