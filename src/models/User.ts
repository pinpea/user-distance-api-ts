interface User {
  id: string;
  last_name: string;
  latitude: number;
  longitude: number;
  distance?: number;
  city?: string;
}
export default User; 