import api from './axios.js';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000');

export const getRequest = async(url) => {
    try {
        // Usamos la instancia 'api' que ya tiene el interceptor del token
        console.log('aasda', url)
        const response = await api.get(url)
        return {data: response.data}
    } catch (error) {
        // Relanzamos el error para que el componente que llama a la función
        // pueda manejarlo en un bloque catch.
        console.error(`Error en la petición GET a /${url}:`, error);
        throw error;
    }
}

export const getByIdRequest = async(url, id) => {
    try {
        const response = await api.get(`${url}/${id}`)
        return {data: response.data}
    } catch (error) {
        console.error(`Error en la petición GET a /${url}/${id}:`, error)
        throw error
    
    }
}

export const postRequest = async(url, data) => {
    try {
        const urlServidor = `${API_URL}/${url}`
        const response = await api.post(urlServidor, data)
        return {data: response.data}
    } catch (error) {
        console.error(`Error en la petición POST a /${url}:`, error)
        throw error
    
    }
}

export const patchRequest = async(url, data) => {
    try {
        const urlServidor = `${API_URL}/${url}`
        const response = await api.patch(urlServidor, data)
        return {data: response.data}
    } catch (error) {
        console.error(`Error en la petición PATCH a /${url}:`, error)
        throw error
   
    }
}

export const deleteRequest = async(url) => {
    try {
        const urlServidor = `${API_URL}/${url}`
        const response = await api.delete(urlServidor)
        return {data: response.data}
    } catch (error) {
        console.error(`Error en la petición DELETE a /${url}:`, error)
        throw error
    }
}