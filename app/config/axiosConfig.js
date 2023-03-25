const token_value = localStorage.getItem('token');

export const axiosConfig = {
    headers: {
      Authorization : `Bearer ${token_value}`,
    }
}