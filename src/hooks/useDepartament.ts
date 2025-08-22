import axios from 'axios'
import type { Departament } from "@/interfaces/departament";

export const useDepartament = () => {
  const getDepartaments = async () => {
    const response = await axios.get<Departament[]>('/departamentos');
    return response.data;
  };

  return {
    getDepartaments
  };
};
