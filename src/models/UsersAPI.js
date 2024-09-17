import API, { BASE_URL } from "./API";

const UsersAPI = {
    // Get Bill Types by Currency Code
    getUsers: async () => {
      try {
        const response = await API.get(BASE_URL, '/users');
        return response;
      } catch (error) {
        console.error('Error getUsers:', error);
        return error;
      }
    },
    getUserByNickname: async (username) => {
      try {
        const response = await API.get(BASE_URL, '/users/username', { params: { username } });
        return response;
      } catch (error) {
        return error;
      }
    },
    createUser: async (data) => {
      try {
        const response = await API.post(BASE_URL, '/users/register', data);
        return response;
      } catch (error) {
        return error;
      }
    },
    authUser: async (data) => {
      try {
        const response = await API.post(BASE_URL, '/users/login', data);
        return response;
      } catch (error) {
        return error;
      }
    },

    getUserByEmail : async (email) => {
        try {
          // Pass email as a query parameter
          const response = await API.get(BASE_URL, '/users/email', { params: { email } });
          return response;
        } catch (error) {
          return error;
        }
      }
  };

export default UsersAPI;
// // Create a custom hook to use in your components
// export const useUsersCache = () => {
//   return useQuery({
//     queryKey: ['users'],  // Unique key for caching
//     queryFn: () => UsersAPI.getUsers(),  // API function
//     staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes) // TODO add this as a constant
//     cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
//   });
// };